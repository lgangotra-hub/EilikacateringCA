import { Category, GithubConfig, Product, StoreSettings, ThemeId } from '../types';

export interface StoreDataBundle {
  version: number;
  lastUpdated: string;
  storeSettings: StoreSettings;
  products: Product[];
  categories: Category[];
  themeId?: ThemeId;
}

const DATA_FILE_PATH = 'data/store-data.json';

/**
 * Commits the entire store configuration (settings, products, categories, themes)
 * to the GitHub repository as a JSON bundle.
 * This makes every admin change instantly live WORLDWIDE for all visitors.
 */
export async function commitStoreDataWorldwide(
  config: GithubConfig,
  bundle: StoreDataBundle
): Promise<{ success: boolean; message: string; url?: string }> {
  const token = config.personalAccessToken?.trim();
  if (!token) {
    return {
      success: false,
      message: 'GitHub Personal Access Token (PAT) missing. Please add token in GitHub API tab.',
    };
  }

  const owner = config.username?.trim() || 'lgangotra-hub';
  const repo = config.repository?.trim() || 'EilikacateringCA';
  const branch = config.branch?.trim() || 'main';

  try {
    const jsonString = JSON.stringify(bundle, null, 2);
    // Convert to UTF-8 Base64 properly for browser
    const base64Data = btoa(unescape(encodeURIComponent(jsonString)));

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${DATA_FILE_PATH}`;

    // First, check if the file already exists to get its SHA (required for GitHub update)
    let sha: string | undefined = undefined;
    try {
      const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        sha = fileInfo.sha;
      }
    } catch {
      // file might not exist yet
    }

    const payload: { message: string; content: string; branch: string; sha?: string } = {
      message: `Worldwide Live Update: Store settings & products synced at ${new Date().toISOString()}`,
      content: base64Data,
      branch: branch,
    };
    if (sha) {
      payload.sha = sha;
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (putRes.ok) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${DATA_FILE_PATH}`;
      return {
        success: true,
        message: `Worldwide Live Sync Successful! Synced ${bundle.products.length} products to GitHub CDN.`,
        url: rawUrl,
      };
    } else {
      const err = await putRes.json().catch(() => ({}));
      return {
        success: false,
        message: `GitHub commit failed: ${err.message || putRes.statusText}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Network or Sync error: ${error?.message || 'Unknown error'}`,
    };
  }
}

/**
 * Fetches the latest live store data from the GitHub repository CDN.
 * Falls back safely if the file doesn't exist yet or if offline.
 */
export async function fetchLiveStoreDataFromWorldwideCdn(
  owner = 'lgangotra-hub',
  repo = 'EilikacateringCA',
  branch = 'main'
): Promise<StoreDataBundle | null> {
  try {
    // Add cache buster to always get fresh data from worldwide CDN
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${DATA_FILE_PATH}?t=${Date.now()}`;
    const res = await fetch(rawUrl, {
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.storeSettings && Array.isArray(data.products)) {
        return data as StoreDataBundle;
      }
    }
  } catch (err) {
    console.warn('Worldwide CDN data fetch skipped or not yet initialized on GitHub:', err);
  }
  return null;
}
