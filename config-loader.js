let GOOGLE_MAPS_API_KEY;

// Check if we're on GitHub Pages first
const hostname = window.location.hostname;
const isGitHubPages = hostname.includes('github.io') || hostname.includes('github.com');

try {
  if (isGitHubPages) {
    // On GitHub Pages, always use production config
    const prod = await import('./config.js');
    GOOGLE_MAPS_API_KEY = prod.GOOGLE_MAPS_API_KEY;
    console.log('[Config Loader] GitHub Pages detected, loaded from config.js');
    console.log('[Config Loader] API Key loaded:', GOOGLE_MAPS_API_KEY ? `${GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'MISSING');
    
    // Check if key is still placeholder
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'PLACEHOLDER') {
      console.error('[Config Loader] ERROR: API key is still PLACEHOLDER! The GitHub Actions workflow did not replace it.');
      throw new Error('API key not configured. Check GitHub Actions workflow.');
    }
  } else {
    // Only try to load local config when running locally
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' ||
                    hostname === '' ||
                    hostname.startsWith('192.168.') ||
                    hostname.startsWith('10.') ||
                    hostname.startsWith('172.');
    
    if (isLocal) {
      try {
        const local = await import('./config.local.js');
        GOOGLE_MAPS_API_KEY = local.GOOGLE_MAPS_API_KEY;
        console.log('[Config Loader] Local environment detected, loaded from config.local.js');
      } catch (e) {
        // Fall back to production config if local config doesn't exist
        const prod = await import('./config.js');
        GOOGLE_MAPS_API_KEY = prod.GOOGLE_MAPS_API_KEY;
        console.log('[Config Loader] Local config not found, using config.js');
      }
    } else {
      // Not local and not GitHub Pages, use production config
      const prod = await import('./config.js');
      GOOGLE_MAPS_API_KEY = prod.GOOGLE_MAPS_API_KEY;
      console.log('[Config Loader] Using production config.js');
    }
  }
} catch (error) {
  console.error('[Config Loader] Failed to load config:', error);
  throw error;
}

export { GOOGLE_MAPS_API_KEY };
