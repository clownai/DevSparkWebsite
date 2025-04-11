// Script to connect login page with OAuth service
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    setupFormHandlers();
    setupOAuthHandlers();
});

// Create particle background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random end position for animation
        const endX = (Math.random() - 0.5) * 200;
        const endY = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        
        // Random animation duration between 20s and 40s
        const duration = Math.random() * 20 + 20;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        // Random color (accent primary, accent secondary, or highlight)
        const colors = ['#8A2BE2', '#FF5722', '#00E5FF'];
        const colorIndex = Math.floor(Math.random() * colors.length);
        particle.style.backgroundColor = colors[colorIndex];
        particle.style.boxShadow = `0 0 10px ${colors[colorIndex]}, 0 0 20px ${colors[colorIndex]}`;
        
        particlesContainer.appendChild(particle);
    }
}

// Handle form submission
function setupFormHandlers() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
            // Show loading state
            const loginButton = document.getElementById('login-button');
            const loginSpinner = document.getElementById('login-spinner');
            const loginText = document.getElementById('login-text');
            
            loginSpinner.style.display = 'inline-block';
            loginText.textContent = 'Signing in...';
            loginButton.disabled = true;
            
            try {
                // Import the OAuth service
                const oauthService = await import('./oauth-service.js').then(module => module.default);
                
                // Call the login method
                const result = await oauthService.loginWithEmailPassword(email, password);
                
                // Store authentication data
                localStorage.setItem('auth_token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Redirect to dashboard or account page
                window.location.href = 'account.html';
            } catch (error) {
                console.error('Login error:', error);
                
                // Reset button state
                loginSpinner.style.display = 'none';
                loginText.textContent = 'Sign In';
                loginButton.disabled = false;
                
                // Show error message
                alert('Login failed: ' + (error.message || 'Unknown error'));
            }
        }
    });
}

// Setup OAuth button handlers
function setupOAuthHandlers() {
    const oauthButtons = document.querySelectorAll('.oauth-button');
    
    oauthButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const provider = this.getAttribute('data-provider');
            if (!provider) return;
            
            // Show loading state
            const originalContent = this.innerHTML;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Connecting...</span>`;
            this.disabled = true;
            
            try {
                // Import the OAuth service
                const oauthService = await import('./oauth-service.js').then(module => module.default);
                
                // Initialize OAuth service if needed
                oauthService.init();
                
                // Initiate OAuth flow
                oauthService.initiateOAuth(provider);
                
                // Note: The page will be redirected to the OAuth provider
                // The rest of the flow will be handled by the callback
            } catch (error) {
                console.error(`OAuth error (${provider}):`, error);
                
                // Reset button state
                this.innerHTML = originalContent;
                this.disabled = false;
                
                // Show error message
                alert(`Authentication with ${provider} failed: ${error.message || 'Unknown error'}`);
            }
        });
    });
}

// Handle OAuth callback
// This would be called when the user is redirected back from the OAuth provider
async function handleOAuthCallback() {
    // Check if this is a callback URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const provider = urlParams.get('provider');
    
    if (code && provider) {
        try {
            // Import the OAuth service
            const oauthService = await import('./oauth-service.js').then(module => module.default);
            
            // Exchange code for token
            const authResult = await oauthService.handleCallback(provider, window.location.href);
            
            // Store authentication data
            localStorage.setItem('auth_token', authResult.accessToken);
            localStorage.setItem('user', JSON.stringify(authResult.userProfile));
            
            // Redirect to account page
            window.location.href = 'account.html';
        } catch (error) {
            console.error('OAuth callback error:', error);
            alert('Authentication failed: ' + (error.message || 'Unknown error'));
            
            // Redirect back to login page
            window.location.href = 'login.html';
        }
    }
}

// Check if this is a callback URL
if (window.location.search.includes('code=')) {
    handleOAuthCallback();
}

// Export functions for testing
export { setupFormHandlers, setupOAuthHandlers, handleOAuthCallback };
