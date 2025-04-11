// DevSpark Website - Dark Game Theme JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Apply dark game theme
    initDarkGameTheme();
});

// Initialize dark game theme
function initDarkGameTheme() {
    // Create particle background
    createParticles();
    
    // Add scroll effects
    addScrollEffects();
    
    // Add hover effects
    addHoverEffects();
    
    // Add typing effect to code blocks
    addTypingEffect();
    
    // Add interactive elements
    addInteractiveElements();
    
    console.log('Dark Game Theme initialized');
}

// Create particle background
function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
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

// Add scroll effects
function addScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// Add hover effects
function addHoverEffects() {
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.classList.add('animate-pulse');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.classList.remove('animate-pulse');
            }
        });
    });
    
    // Download options hover effect
    const downloadOptions = document.querySelectorAll('.download-option');
    downloadOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            const icon = option.querySelector('.download-icon');
            if (icon) {
                icon.classList.add('animate-float');
            }
        });
        
        option.addEventListener('mouseleave', () => {
            const icon = option.querySelector('.download-icon');
            if (icon) {
                icon.classList.remove('animate-float');
            }
        });
    });
}

// Add typing effect to code blocks
function addTypingEffect() {
    const codeBlocks = document.querySelectorAll('.code-content');
    
    codeBlocks.forEach(block => {
        const originalContent = block.innerHTML;
        block.innerHTML = '';
        
        let isTyping = false;
        
        const typeCode = () => {
            if (isTyping) return;
            
            isTyping = true;
            let i = 0;
            const text = originalContent;
            block.innerHTML = '';
            
            const typing = setInterval(() => {
                if (i < text.length) {
                    block.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    isTyping = false;
                }
            }, 10);
        };
        
        // Start typing when the code block comes into view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeCode();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(block);
    });
}

// Add interactive elements
function addInteractiveElements() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Copy code button
    const copyButtons = document.querySelectorAll('.code-copy');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.code-block');
            const codeContent = codeBlock.querySelector('.code-content').textContent;
            
            navigator.clipboard.writeText(codeContent).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email && isValidEmail(email)) {
                // Show success message
                const formContainer = newsletterForm.parentElement;
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.innerHTML = `
                    <div class="success-icon">✓</div>
                    <p>Thank you for subscribing to our newsletter!</p>
                `;
                
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
            } else {
                // Show error
                emailInput.classList.add('error');
                
                setTimeout(() => {
                    emailInput.classList.remove('error');
                }, 2000);
            }
        });
    }
}

// Validate email format
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        }
    });
});

// Add testimonial slider functionality
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const testimonials = slider.querySelectorAll('.testimonial-item');
    if (testimonials.length <= 1) return;
    
    let currentIndex = 0;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('slider-dots');
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    slider.appendChild(dotsContainer);
    
    // Create navigation arrows
    const prevButton = document.createElement('button');
    prevButton.classList.add('slider-arrow', 'prev-arrow');
    prevButton.innerHTML = '❮';
    prevButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });
    
    const nextButton = document.createElement('button');
    nextButton.classList.add('slider-arrow', 'next-arrow');
    nextButton.innerHTML = '❯';
    nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });
    
    slider.appendChild(prevButton);
    slider.appendChild(nextButton);
    
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
        if (index !== 0) {
            testimonial.style.display = 'none';
        }
    });
    
    // Function to go to a specific slide
    function goToSlide(index) {
        // Handle index bounds
        if (index < 0) {
            index = testimonials.length - 1;
        } else if (index >= testimonials.length) {
            index = 0;
        }
        
        // Hide current testimonial
        testimonials[currentIndex].style.display = 'none';
        
        // Show new testimonial
        testimonials[index].style.display = 'block';
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots[currentIndex].classList.remove('active');
        dots[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
    }
    
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
}

// Initialize testimonial slider
initTestimonialSlider();
