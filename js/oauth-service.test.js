// Authentication System Test Script for DevSparkWebsite
// This script tests the OAuth service and login functionality

// Test configuration
const testConfig = {
    google: {
        clientId: 'test-google-client-id',
        redirectUri: 'http://localhost:8080/auth/google/callback'
    },
    github: {
        clientId: 'test-github-client-id',
        redirectUri: 'http://localhost:8080/auth/github/callback'
    },
    microsoft: {
        clientId: 'test-microsoft-client-id',
        redirectUri: 'http://localhost:8080/auth/microsoft/callback'
    },
    apple: {
        clientId: 'test-apple-client-id',
        redirectUri: 'http://localhost:8080/auth/apple/callback'
    },
    twitter: {
        clientId: 'test-twitter-client-id',
        redirectUri: 'http://localhost:8080/auth/twitter/callback'
    },
    discord: {
        clientId: 'test-discord-client-id',
        redirectUri: 'http://localhost:8080/auth/discord/callback'
    }
};

// Mock fetch for testing
window.fetch = async (url, options) => {
    console.log(`Mock fetch called with URL: ${url}`);
    console.log('Options:', options);
    
    // Simulate successful token response
    if (url.includes('/api/auth/token')) {
        return {
            ok: true,
            json: async () => ({
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_in: 3600,
                token_type: 'Bearer'
            })
        };
    }
    
    // Simulate successful user profile response
    if (url.includes('/api/auth/profile')) {
        return {
            ok: true,
            json: async () => ({
                provider: options.headers.Authorization.split(' ')[1].includes('google') ? 'google' : 'github',
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                avatar: 'https://example.com/avatar.jpg'
            })
        };
    }
    
    // Simulate successful login response
    if (url.includes('/api/auth/login')) {
        return {
            ok: true,
            json: async () => ({
                token: 'mock-jwt-token',
                user: {
                    id: 'user123',
                    name: 'Test User',
                    email: 'test@example.com'
                }
            })
        };
    }
    
    // Simulate successful registration response
    if (url.includes('/api/auth/register')) {
        return {
            ok: true,
            json: async () => ({
                token: 'mock-jwt-token',
                user: {
                    id: 'user123',
                    name: 'Test User',
                    email: 'test@example.com'
                }
            })
        };
    }
    
    // Simulate successful password reset request response
    if (url.includes('/api/auth/forgot-password')) {
        return {
            ok: true,
            json: async () => ({
                message: 'Password reset email sent'
            })
        };
    }
    
    return {
        ok: false,
        json: async () => ({ message: 'Not found' })
    };
};

// Import the OAuth service (in a real test, this would be imported properly)
// For this test script, we'll create a mock instance based on the implementation
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

    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    async exchangeCodeForToken(provider, code) {
        if (!this.providers[provider]) {
            throw new Error(`Provider ${provider} not supported`);
        }

        const providerConfig = this.providers[provider];
        
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

    async handleCallback(provider, url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
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

    initiateOAuth(provider) {
        const authUrl = this.getAuthorizationUrl(provider);
        window.location.href = authUrl;
    }
    
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

const oauthService = new OAuthService();

// Test initialization
function testInit() {
    console.log('Testing OAuth service initialization...');
    oauthService.init(testConfig);
    console.log('OAuth service initialized with test configuration');
}

// Test authorization URL generation
function testAuthorizationUrl() {
    console.log('Testing authorization URL generation...');
    
    const providers = ['google', 'github', 'microsoft', 'apple', 'twitter', 'discord'];
    
    providers.forEach(provider => {
        try {
            const authUrl = oauthService.getAuthorizationUrl(provider);
            console.log(`${provider} authorization URL: ${authUrl}`);
            
            // Verify URL contains required parameters
            const urlParams = new URL(authUrl).searchParams;
            console.assert(urlParams.has('client_id'), `${provider} URL missing client_id`);
            console.assert(urlParams.has('redirect_uri'), `${provider} URL missing redirect_uri`);
            console.assert(urlParams.has('scope'), `${provider} URL missing scope`);
            console.assert(urlParams.has('response_type'), `${provider} URL missing response_type`);
            console.assert(urlParams.has('state'), `${provider} URL missing state`);
            
            console.log(`${provider} authorization URL generation: SUCCESS`);
        } catch (error) {
            console.error(`${provider} authorization URL generation: FAILED`, error);
        }
    });
}

// Test OAuth callback handling
async function testOAuthCallback() {
    console.log('Testing OAuth callback handling...');
    
    const testProvider = 'google';
    const testCode = 'test-auth-code';
    const testCallbackUrl = `http://localhost:8080/auth/google/callback?code=${testCode}&state=test-state`;
    
    try {
        const result = await oauthService.handleCallback(testProvider, testCallbackUrl);
        
        console.log('OAuth callback result:', result);
        
        // Verify result contains expected properties
        console.assert(result.provider === testProvider, 'Result has incorrect provider');
        console.assert(result.accessToken === 'mock-access-token', 'Result missing access token');
        console.assert(result.refreshToken === 'mock-refresh-token', 'Result missing refresh token');
        console.assert(result.expiresIn === 3600, 'Result has incorrect expires_in');
        console.assert(result.userProfile, 'Result missing user profile');
        
        console.log('OAuth callback handling: SUCCESS');
    } catch (error) {
        console.error('OAuth callback handling: FAILED', error);
    }
}

// Test email/password login
async function testEmailPasswordLogin() {
    console.log('Testing email/password login...');
    
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    try {
        const result = await oauthService.loginWithEmailPassword(testEmail, testPassword);
        
        console.log('Email/password login result:', result);
        
        // Verify result contains expected properties
        console.assert(result.token === 'mock-jwt-token', 'Result missing JWT token');
        console.assert(result.user, 'Result missing user data');
        console.assert(result.user.email === testEmail, 'Result has incorrect user email');
        
        console.log('Email/password login: SUCCESS');
    } catch (error) {
        console.error('Email/password login: FAILED', error);
    }
}

// Test user registration
async function testRegistration() {
    console.log('Testing user registration...');
    
    const testUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };
    
    try {
        const result = await oauthService.register(testUserData);
        
        console.log('Registration result:', result);
        
        // Verify result contains expected properties
        console.assert(result.token === 'mock-jwt-token', 'Result missing JWT token');
        console.assert(result.user, 'Result missing user data');
        console.assert(result.user.email === testUserData.email, 'Result has incorrect user email');
        
        console.log('User registration: SUCCESS');
    } catch (error) {
        console.error('User registration: FAILED', error);
    }
}

// Test password reset request
async function testPasswordReset() {
    console.log('Testing password reset request...');
    
    const testEmail = 'test@example.com';
    
    try {
        const result = await oauthService.requestPasswordReset(testEmail);
        
        console.log('Password reset request result:', result);
        
        // Verify result contains expected properties
        console.assert(result.message === 'Password reset email sent', 'Result has incorrect message');
        
        console.log('Password reset request: SUCCESS');
    } catch (error) {
        console.error('Password reset request: FAILED', error);
    }
}

// Run all tests
async function runTests() {
    console.log('Starting OAuth service tests for website...');
    
    testInit();
    testAuthorizationUrl();
    await testOAuthCallback();
    await testEmailPasswordLogin();
    await testRegistration();
    await testPasswordReset();
    
    console.log('All website authentication tests completed');
}

// Execute tests when script is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, running tests...');
    runTests().catch(error => {
        console.error('Test execution failed:', error);
    });
});
