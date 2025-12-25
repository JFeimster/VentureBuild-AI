
import { CodeFile } from '../types';

export interface VercelDeploymentResponse {
  id: string;
  name: string;
  url: string; // The deployment URL (e.g. project-name.vercel.app)
  inspectorUrl: string; // URL to inspect deployment in Vercel dashboard
  readyState: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  error?: {
    code: string;
    message: string;
  };
}

export const deployToVercel = async (
  token: string, 
  projectFiles: CodeFile[], 
  projectName: string
): Promise<VercelDeploymentResponse> => {
  
  // Transform CodeFiles to Vercel API format
  // Vercel API expects { file: 'path', data: 'content' }
  const filesPayload = projectFiles.map(f => ({
    file: f.path,
    data: f.content
  }));

  // Clean project name (Vercel requirements: max 100 chars, lowercase, alphanumeric, hyphens)
  const safeProjectName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 99);

  // Auto-detect framework for better build handling
  const isNextJs = projectFiles.some(f => f.path === 'package.json' && f.content.includes('"next"'));

  try {
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: safeProjectName || 'venture-build-project',
        files: filesPayload,
        projectSettings: {
            // Basic settings to help Vercel auto-detect. 
            // Explicitly setting nextjs helps avoid issues if auto-detection is ambiguous.
            framework: isNextJs ? 'nextjs' : null
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Deployment failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Normalize response
    return {
      id: data.id,
      name: data.name,
      url: `https://${data.url}`, // Vercel returns url without protocol
      inspectorUrl: data.inspectorUrl,
      readyState: data.readyState
    };

  } catch (error: any) {
    console.error("Vercel Deployment Error:", error);
    throw error;
  }
};
