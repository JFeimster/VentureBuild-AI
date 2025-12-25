
import { CodeFile } from '../types';

interface GitHubRepo {
  name: string;
  html_url: string;
  full_name: string;
}

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
        private: true, // Default to private for safety
        auto_init: true // Initialize with README to make pushing easier (creates a HEAD)
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

export const pushFilesToGitHub = async (
  token: string, 
  owner: string, 
  repo: string, 
  files: CodeFile[]
) => {
  // We use the REST API to create/update files. 
  // NOTE: For a production app, the Git Data API (Tree/Commit) is better for batching,
  // but for <20 files, sequential PUT requests are acceptable and easier to debug/implement client-side.
  
  // 1. Get the default branch (usually main)
  const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
     headers: { 'Authorization': `token ${token}` }
  });
  const repoInfo = await repoInfoRes.json();
  const branch = repoInfo.default_branch || 'main';

  for (const file of files) {
    try {
      // Check if file exists to get SHA (needed for update)
      // This might fail if file doesn't exist, which is fine
      let sha: string | undefined;
      try {
        const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
          headers: { 'Authorization': `token ${token}` }
        });
        if (checkRes.ok) {
          const data = await checkRes.json();
          sha = data.sha;
        }
      } catch (e) {
        // ignore
      }

      // Convert content to Base64 (handle Unicode)
      const contentBase64 = btoa(unescape(encodeURIComponent(file.content)));

      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${file.path} via Venture Build AI`,
          content: contentBase64,
          branch: branch,
          sha: sha // Only included if file exists
        })
      });

      if (!putRes.ok) {
        console.warn(`Failed to push ${file.path}`, await putRes.json());
      }
    } catch (err) {
      console.error(`Error pushing file ${file.path}:`, err);
    }
  }
};
