// OAuth Integration Service for DevSparkWebsite
// This service handles OAuth authentication for multiple providers

class OAuthService {
    constructor() {
        this.providers = {
            google: {
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                redirectUri: window.location.origin + '/auth/google/callback',
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                tokenUrl: 'https://oauth2.googleapis.com/token',
                scope: 'email profile',
                responseType: 'code'
            },
            github: {
                clientId: 'YOUR_GITHUB_CLIENT_ID',
                redirectUri: window.location.origin + '/auth/github/callback',
                authUrl: 'https://github.com/login/oauth/authorize',
                tokenUrl: 'https://github.com/login/oauth/access_token',
                scope: 'user:email',
                responseType: 'code'
            },
            microsoft: {
                clientId: 'YOUR_MICROSOFT_CLIENT_ID',
                redirectUri: window.location.origin + '/auth/microsoft/callback',
                authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                scope: 'openid profile email',
                responseType: 'code'
            },
            apple: {
                clientId: 'YOUR_APPLE_CLIENT_ID',
                redirectUri: window.location.origin + '/auth/apple/callback',
                authUrl: 'https://appleid.apple.com/auth/authorize',
                tokenUrl: 'https://appleid.apple.com/auth/token',
                scope: 'name email',
                responseType: 'code'
            },
            twitter: {
                clientId: 'YOUR_TWITTER_CLIENT_ID',
                redirectUri: window.location.origin + '/auth/twitter/callback',
                authUrl: 'https://twitter.com/i/oauth2/authorize',
                tokenUrl: 'https://api.twitter.com/2/oauth2/token',
                scope: 'tweet.read users.read',
                responseType: 'code'
            },
            discord: {
                clientId: 'YOUR_DISCORD_CLIENT_ID',
                redirectUri: window.location.origin + '/auth/discord/callback',
                authUrl: 'https://discord.com/api/oauth2/authorize',
                tokenUrl: 'https://discord.com/api/oauth2/token',
                scope: 'identify email',
                responseType: 'code'
            }
        };
    }

    // Initialize OAuth providers with environment-specific configuration
    init(config) {
        if (config) {
            Object.keys(config).forEach(provider => {
                if (this.providers[provider]) {
                    this.providers[provider] = {
                        ...this.providers[provider],
                        ...config[provider]
                    };
                }
            });
        }
        
        console.log('OAuth providers initialized for website');
    }

    // Generate OAuth authorization URL for the specified provider
    getAuthorizationUrl(provider) {
        if (!this.providers[provider]) {
            throw new Error(`Provider ${provider} not supported`);
        }

        const providerConfig = this.providers[provider];
        const params = new URLSearchParams({
            client_id: providerConfig.clientId,
            redirect_uri: providerConfig.redirectUri,
            scope: providerConfig.scope,
            response_type: providerConfig.responseType,
            state: this.generateState()
        });

        return `${providerConfig.authUrl}?${params.toString()}`;
    }

    // Generate a random state parameter to prevent CSRF attacks
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Exchange authorization code for access token
    async exchangeCodeForToken(provider, code) {
        if (!this.providers[provider]) {
            throw new Error(`Provider ${provider} not supported`);
        }

        const providerConfig = this.providers[provider];
        
        // In a real implementation, this would be done server-side
        // to protect client secrets
        const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider,
                code,
                redirectUri: providerConfig.redirectUri
            })
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }

        return await response.json();
    }

    // Get user profile from provider using access token
    async getUserProfile(provider, accessToken) {
        const response = await fetch(`/api/auth/profile?provider=${provider}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to get user profile');
        }

        return await response.json();
    }

    // Handle OAuth callback
    async handleCallback(provider, url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        // Verify state parameter to prevent CSRF attacks
        // In a real implementation, you would compare this with the state stored in session
        
        if (!code) {
            throw new Error('No authorization code found in callback URL');
        }

        const tokenResponse = await this.exchangeCodeForToken(provider, code);
        const userProfile = await this.getUserProfile(provider, tokenResponse.access_token);
        
        return {
            provider,
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expiresIn: tokenResponse.expires_in,
            userProfile
        };
    }

    // Initiate OAuth flow for a provider
    initiateOAuth(provider) {
        const authUrl = this.getAuthorizationUrl(provider);
        window.location.href = authUrl;
    }
    
    // Handle login with email and password
    async loginWithEmailPassword(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    // Handle user registration
    async register(userData) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    // Handle password reset request
    async requestPasswordReset(email) {
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Password reset request failed');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error;
        }
    }
}

// Export the service
const oauthService = new OAuthService();
export default oauthService;
