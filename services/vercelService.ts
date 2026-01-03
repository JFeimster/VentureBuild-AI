
import { CodeFile } from '../types';

export interface VercelDeploymentResponse {
  id: string;
  name: string;
  url: string; 
  inspectorUrl: string; 
  readyState: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Deploys project files to Vercel using the Deployments API.
 */
export const deployToVercel = async (
  token: string, 
  projectFiles: CodeFile[], 
  projectName: string
): Promise<VercelDeploymentResponse> => {
  
  // Transform CodeFiles to Vercel API format
  const filesPayload = projectFiles.map(f => ({
    file: f.path,
    data: f.content
  }));

  // Vercel requirements: max 100 chars, lowercase, alphanumeric, hyphens
  const safeProjectName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 99);

  // Detect framework
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
            framework: isNextJs ? 'nextjs' : null
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Vercel API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      url: `https://${data.url}`,
      inspectorUrl: data.inspectorUrl,
      readyState: data.readyState
    };

  } catch (error: any) {
    console.error("Vercel Deployment Error:", error);
    throw error;
  }
};
