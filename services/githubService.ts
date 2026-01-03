
import { CodeFile } from '../types';

interface GitHubRepo {
  name: string;
  html_url: string;
  full_name: string;
}

/**
 * Creates a new private repository on GitHub.
 */
export const createGitHubRepo = async (token: string, name: string): Promise<GitHubRepo> => {
  try {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        name,
        private: true,
        auto_init: true // Initialize with README to create the main branch/HEAD
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create repository');
    }

    return await response.json();
  } catch (error: any) {
    console.error('GitHub Create Repo Error:', error);
    throw error;
  }
};

/**
 * Pushes multiple files to a GitHub repository in a single atomic commit.
 * Uses the Git Data API: Blobs -> Tree -> Commit -> Ref
 */
export const pushFilesToGitHub = async (
  token: string, 
  owner: string, 
  repo: string, 
  files: CodeFile[]
) => {
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  // 1. Get the latest commit SHA of the default branch
  const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  const repoInfo = await repoInfoRes.json();
  const branch = repoInfo.default_branch || 'main';

  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, { headers });
  const refData = await refRes.json();
  const lastCommitSha = refData.object.sha;

  // 2. Create Blobs for each file
  const treeItems = await Promise.all(files.map(async (file) => {
    const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: btoa(unescape(encodeURIComponent(file.content))),
        encoding: 'base64'
      })
    });
    const blobData = await blobRes.json();
    return {
      path: file.path,
      mode: '100644', // Normal file
      type: 'blob',
      sha: blobData.sha
    };
  }));

  // 3. Create a New Tree
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base_tree: lastCommitSha,
      tree: treeItems
    })
  });
  const treeData = await treeRes.json();

  // 4. Create a New Commit
  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: '🚀 Automated build via Venture Build AI',
      tree: treeData.sha,
      parents: [lastCommitSha]
    })
  });
  const commitData = await commitRes.json();

  // 5. Update the Reference
  const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      sha: commitData.sha,
      force: true
    })
  });

  if (!updateRefRes.ok) {
    const err = await updateRefRes.json();
    throw new Error(err.message || 'Failed to update branch reference');
  }
};
