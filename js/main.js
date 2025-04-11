// DevSpark Website JavaScript
// This file contains the interactive functionality for the DevSpark website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                    }
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Testimonials slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        // Auto-scroll testimonials
        let scrollPosition = 0;
        const testimonials = testimonialsSlider.querySelectorAll('.testimonial');
        const testimonialWidth = testimonials.length > 0 ? testimonials[0].offsetWidth + 30 : 0; // Width + gap
        
        setInterval(() => {
            scrollPosition += testimonialWidth;
            if (scrollPosition >= testimonialsSlider.scrollWidth) {
                scrollPosition = 0;
            }
            testimonialsSlider.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }, 5000);
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // In a real implementation, this would send the email to a server
                // For now, we'll just show a success message
                
                // Clear the input
                const email = emailInput.value;
                emailInput.value = '';
                
                // Show success message
                const formContainer = this.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = `Thank you! ${email} has been subscribed to our newsletter.`;
                
                formContainer.appendChild(successMessage);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.feature-card, .doc-card, .download-card, .testimonial');
    
    if (animateElements.length > 0) {
        // Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );
        }
        
        // Add animation class when element is in viewport
        function checkAnimations() {
            animateElements.forEach(element => {
                if (isInViewport(element) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                }
            });
        }
        
        // Check animations on scroll
        window.addEventListener('scroll', checkAnimations);
        
        // Check animations on page load
        checkAnimations();
    }
    
    // Download buttons functionality
    const downloadButtons = document.querySelectorAll('.download-card .btn');
    if (downloadButtons.length > 0) {
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // In a real implementation, this would initiate a download
                // For now, we'll just show a message
                
                const platform = this.closest('.download-card').querySelector('h3').textContent;
                
                alert(`Thank you for your interest in DevSpark IDE for ${platform}! The download would start automatically in a real implementation.`);
            });
        });
    }
});
