// OAuth service test file for DevSparkWebsite
// This file contains tests for the OAuth service implementation

import oauthService from '../js/oauth-service.js';

// Mock fetch for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      id_token: 'mock_id_token'
    })
  })
);

describe('OAuth Service Tests for Website', () => {
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
    
    // Mock window.location
    delete window.location;
    window.location = { 
      href: '',
      origin: 'https://devspark.app'
    };
  });

  test('should initialize OAuth providers', () => {
    oauthService.init({
      google: {
        clientId: 'test_google_client_id'
      }
    });
    
    expect(oauthService.providers.google.clientId).toBe('test_google_client_id');
  });

  test('should generate authorization URL for Google', () => {
    const authUrl = oauthService.getAuthorizationUrl('google');
    
    expect(authUrl).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(authUrl).toContain('client_id=');
    expect(authUrl).toContain('redirect_uri=');
    expect(authUrl).toContain('scope=email+profile');
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain('state=');
  });

  test('should generate authorization URL for GitHub', () => {
    const authUrl = oauthService.getAuthorizationUrl('github');
    
    expect(authUrl).toContain('https://github.com/login/oauth/authorize');
    expect(authUrl).toContain('client_id=');
    expect(authUrl).toContain('redirect_uri=');
    expect(authUrl).toContain('scope=user%3Aemail');
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain('state=');
  });

  test('should generate authorization URL for Microsoft', () => {
    const authUrl = oauthService.getAuthorizationUrl('microsoft');
    
    expect(authUrl).toContain('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    expect(authUrl).toContain('client_id=');
    expect(authUrl).toContain('redirect_uri=');
    expect(authUrl).toContain('scope=openid+profile+email');
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain('state=');
  });

  test('should generate authorization URL for Twitter', () => {
    const authUrl = oauthService.getAuthorizationUrl('twitter');
    
    expect(authUrl).toContain('https://twitter.com/i/oauth2/authorize');
    expect(authUrl).toContain('client_id=');
    expect(authUrl).toContain('redirect_uri=');
    expect(authUrl).toContain('scope=tweet.read+users.read');
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain('state=');
  });

  test('should generate authorization URL for Discord', () => {
    const authUrl = oauthService.getAuthorizationUrl('discord');
    
    expect(authUrl).toContain('https://discord.com/api/oauth2/authorize');
    expect(authUrl).toContain('client_id=');
    expect(authUrl).toContain('redirect_uri=');
    expect(authUrl).toContain('scope=identify+email');
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain('state=');
  });

  test('should throw error for unsupported provider', () => {
    expect(() => {
      oauthService.getAuthorizationUrl('unsupported');
    }).toThrow('Provider unsupported not supported');
  });

  test('should exchange code for token', async () => {
    await oauthService.exchangeCodeForToken('google', 'test_code');
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/token');
    expect(fetch.mock.calls[0][1].method).toBe('POST');
    expect(JSON.parse(fetch.mock.calls[0][1].body).provider).toBe('google');
    expect(JSON.parse(fetch.mock.calls[0][1].body).code).toBe('test_code');
  });

  test('should get user profile', async () => {
    await oauthService.getUserProfile('google', 'test_token');
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/profile?provider=google');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer test_token');
  });

  test('should handle login with email and password', async () => {
    await oauthService.loginWithEmailPassword('test@example.com', 'password123');
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/login');
    expect(fetch.mock.calls[0][1].method).toBe('POST');
    expect(JSON.parse(fetch.mock.calls[0][1].body).email).toBe('test@example.com');
    expect(JSON.parse(fetch.mock.calls[0][1].body).password).toBe('password123');
  });

  test('should handle user registration', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    await oauthService.register(userData);
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/register');
    expect(fetch.mock.calls[0][1].method).toBe('POST');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(userData);
  });

  test('should handle password reset request', async () => {
    await oauthService.requestPasswordReset('test@example.com');
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/forgot-password');
    expect(fetch.mock.calls[0][1].method).toBe('POST');
    expect(JSON.parse(fetch.mock.calls[0][1].body).email).toBe('test@example.com');
  });
});
