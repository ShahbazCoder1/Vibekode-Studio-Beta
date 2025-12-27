export interface DeploymentResult {
  url: string;
  deployUrl: string;
  siteName: string;
  deployId: string;
  adminUrl?: string;
  siteId: string;
}

export interface DeploymentError {
  message: string;
  code?: string;
}

// Generate a 5-character unique key
const generateUniqueKey = (): string => {
  return Math.random().toString(36).substring(2, 7).toLowerCase();
};

// Compute SHA1 hash for file content
const computeSha1 = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const deployToNetlify = async (
  htmlCode: string,
  projectName: string,
  existingDeployment?: { siteId: string; deployId: string },
  netlifyToken?: string
): Promise<DeploymentResult> => {
  // Use environment variable or provided token
  const token = netlifyToken || process.env.NEXT_PUBLIC_NETLIFY_TOKEN;

  if (!token) {
    throw new Error('Netlify API token is required');
  }

  if (!htmlCode.trim()) {
    throw new Error('HTML code is required');
  }

  try {
    let siteData: {
      id: string;
      name: string;
      ssl_url?: string;
      url: string;
      admin_url?: string;
    };

    if (existingDeployment) {
      // Update existing deployment
      console.log('Updating existing deployment...');

      // Get existing site data
      const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${existingDeployment.siteId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!siteResponse.ok) {
        throw new Error('Failed to fetch existing site data');
      }

      siteData = await siteResponse.json();
    } else {
      // Create new site
      console.log('Creating new deployment...');

      const uniqueKey = generateUniqueKey();
      const cleanProjectName = projectName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 20);

      const siteName = `${cleanProjectName}-${uniqueKey}`;

      const sitePayload = {
        name: siteName
      };

      const siteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sitePayload),
      });

      if (!siteResponse.ok) {
        const errorData = await siteResponse.json().catch(() => ({}));
        let errorMessage = 'Failed to create site';

        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (siteResponse.status === 401) {
          errorMessage = 'Invalid API token';
        } else if (siteResponse.status === 403) {
          errorMessage = 'Access denied. Check API token permissions';
        }

        throw new Error(errorMessage);
      }

      siteData = await siteResponse.json();
    }

    // Step 2: Compute SHA1 of the HTML file
    const htmlSha1 = await computeSha1(htmlCode);

    // Step 3: Create new deploy with file hashes
    const deployPayload = {
      files: {
        '/index.html': htmlSha1
      }
    };

    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteData.id}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deployPayload),
    });

    if (!deployResponse.ok) {
      const errorData = await deployResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create deployment');
    }

    const deployData = await deployResponse.json();

    // Step 4: Upload the HTML file
    const uploadUrl = `https://api.netlify.com/api/v1/deploys/${deployData.id}/files/index.html`;
    const htmlBlob = new Blob([htmlCode], { type: 'text/html' });

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: htmlBlob,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload HTML file');
    }

    // Return deployment result
    const result: DeploymentResult = {
      url: deployData.ssl_url || deployData.deploy_ssl_url || siteData.ssl_url || siteData.url,
      deployUrl: deployData.ssl_url || deployData.deploy_ssl_url || siteData.ssl_url || siteData.url,
      siteName: siteData.name,
      deployId: deployData.id,
      adminUrl: siteData.admin_url,
      siteId: siteData.id,
    };

    return result;

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown deployment error occurred');
  }
};
