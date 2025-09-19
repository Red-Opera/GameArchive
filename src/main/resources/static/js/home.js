// Modern JavaScript with Container Query support and Theme Management
class GameStudioApp {
    constructor() {
        this.currentTheme = null;
        this.init();
    }

    init() {
        this.setupLogoHandling();
        this.setupThemeManagement();
        this.setupNavigation();
        this.setupIntersectionObserver();
        this.setupContainerQueries();
        this.setupAnimations();
        this.setupParallax();
        this.setupAccessibility();
    }

    // Logo Handling
    setupLogoHandling() {
        // Handle logo loading and errors
        const logos = document.querySelectorAll('.logo-image, .footer-logo-image, .hero-logo-bg');
        
        logos.forEach(logo => {
            // Add loading state
            logo.addEventListener('load', () => {
                logo.classList.add('logo-loaded');
            });
            
            // Handle logo load errors
            logo.addEventListener('error', () => {
                console.warn('Logo failed to load:', logo.src);
                this.handleLogoError(logo);
            });
            
            // Preload logo for better performance
            if (logo.src) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = logo.src;
                document.head.appendChild(preloadLink);
            }
        });

        // Brand logo click handler for homepage navigation
        const brandLogo = document.querySelector('.brand-logo');
        if (brandLogo) {
            brandLogo.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
            
            // Make brand logo keyboard accessible
            brandLogo.setAttribute('tabindex', '0');
            brandLogo.setAttribute('role', 'button');
            brandLogo.setAttribute('aria-label', 'Go to top of page');
            
            brandLogo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.scrollToTop();
                }
            });
        }
    }

    handleLogoError(logoElement) {
        // Create fallback when logo fails to load
        const fallback = document.createElement('div');
        fallback.className = 'logo-fallback';
        fallback.textContent = 'GS';
        fallback.style.cssText = `
            width: ${logoElement.offsetWidth || 40}px;
            height: ${logoElement.offsetHeight || 40}px;
            background: var(--clr-primary-500);
            color: var(--clr-text-inverse);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
            border-radius: var(--radius-s);
            font-size: ${(logoElement.offsetWidth || 40) * 0.4}px;
        `;
        
        logoElement.parentNode.replaceChild(fallback, logoElement);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Theme Management
    setupThemeManagement() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme(systemPrefersDark ? 'dark' : 'light');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only apply system theme if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Theme toggle button functionality
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update logo filters for theme
        this.updateLogosForTheme(theme);
        
        // Update section backgrounds for theme
        this.updateSectionColorsForTheme(theme);
        
        // Update theme toggle button state and accessibility
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
            
            // Update icon visibility
            const sunIcon = themeToggle.querySelector('.sun-icon');
            const moonIcon = themeToggle.querySelector('.moon-icon');
            
            if (theme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }

        // Update header background immediately
        this.updateHeaderBackground();

        // Emit custom event for theme change
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme } 
        }));
    }

    updateLogosForTheme(theme) {
        const logos = document.querySelectorAll('.logo-image, .footer-logo-image');
        
        logos.forEach(logo => {
            if (theme === 'dark') {
                logo.style.filter = 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1)) brightness(1.1)';
            } else {
                logo.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))';
            }
        });
    }

    updateSectionColorsForTheme(theme) {
        const aboutSection = document.querySelector('.about');
        const footerSection = document.querySelector('.footer');
        
        // About 섹션 색상 업데이트 - 라이트 모드에서는 밝은 배경, 다크 모드에서는 어두운 배경
        if (aboutSection) {
            if (theme === 'dark') {
                aboutSection.style.background = 'var(--clr-surface-secondary)';
                aboutSection.style.color = 'var(--clr-text-primary)';
            } else {
                aboutSection.style.background = 'var(--clr-surface-secondary)';
                aboutSection.style.color = 'var(--clr-text-primary)';
            }
        }
        
        // Footer 섹션 색상 업데이트 - 다크 모드에서는 더 어두운 배경
        if (footerSection) {
            if (theme === 'dark') {
                footerSection.style.background = 'var(--clr-surface-darker)';
                footerSection.style.color = 'var(--clr-text-inverse)';
            } else {
                footerSection.style.background = 'var(--clr-surface-dark)';
                footerSection.style.color = 'var(--clr-text-inverse)';
            }
        }
        
        // Achievement 숫자 색상 업데이트
        const achievementNumbers = document.querySelectorAll('.achievement-number');
        achievementNumbers.forEach(number => {
            number.style.color = 'var(--clr-accent-500)';
        });
        
        // Team stat 카드 색상 업데이트
        const teamStats = document.querySelectorAll('.team-stat');
        teamStats.forEach(stat => {
            stat.style.background = 'var(--clr-surface-elevated)';
            stat.style.borderColor = 'var(--clr-border-primary)';
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add a subtle animation feedback
        this.createThemeToggleEffect();
    }

    createThemeToggleEffect() {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: ${this.currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
            transform: scale(0);
            animation: themeRipple 0.6s ease-out;
            pointer-events: none;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            margin-left: -50%;
            margin-top: -50%;
        `;

        toggle.style.position = 'relative';
        toggle.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (!header) return;

        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            const bgColor = this.currentTheme === 'dark' 
                ? 'rgba(34, 34, 40, 0.98)' 
                : 'rgba(255, 255, 252, 0.98)';
            header.style.background = bgColor;
        } else {
            const bgColor = this.currentTheme === 'dark' 
                ? 'rgba(34, 34, 40, 0.95)' 
                : 'rgba(255, 255, 252, 0.95)';
            header.style.background = bgColor;
        }
    }

    // Navigation functionality
    setupNavigation() {
        const header = document.querySelector('.header');
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav-list');
        
        // Mobile navigation toggle
        navToggle?.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('nav-open');
            document.body.classList.toggle('nav-active');
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile nav if open
                    navList.classList.remove('nav-open');
                    navToggle?.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-active');
                }
            });
        });

        // Enhanced header scroll behavior with theme awareness
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Update background based on current theme and scroll position
            this.updateHeaderBackground();

            // Hide/show header based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animations for achievements
                    if (entry.target.classList.contains('achievement-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll([
            '.hero-content',
            '.section-title',
            '.project-card',
            '.service-item',
            '.achievement-number',
            '.team-stat'
        ].join(',')).forEach(el => {
            observer.observe(el);
        });
    }

    // Container query polyfill for older browsers
    setupContainerQueries() {
        // Check if container queries are supported
        if (!CSS.supports('container-type', 'inline-size')) {
            console.log('Container queries not supported, using fallback');
            
            // Implement ResizeObserver fallback for container queries
            const containers = document.querySelectorAll('[data-container]');
            
            if ('ResizeObserver' in window) {
                const resizeObserver = new ResizeObserver(entries => {
                    entries.forEach(entry => {
                        const { width } = entry.contentRect;
                        const container = entry.target;
                        
                        // Apply breakpoint classes based on container width
                        container.classList.toggle('container-sm', width < 480);
                        container.classList.toggle('container-md', width >= 480 && width < 768);
                        container.classList.toggle('container-lg', width >= 768);
                    });
                });

                containers.forEach(container => {
                    resizeObserver.observe(container);
                });
            }
        }
    }

    // Animation utilities
    setupAnimations() {
        // Visual cards hover effect
        document.querySelectorAll('.visual-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createHoverEffect(card);
            });
        });

        // Play button interactions
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerPlayAnimation(button);
            });
        });

        // Service items interactive effects
        document.querySelectorAll('.service-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addRippleEffect(item);
            });
        });

        // Logo pulse animation on page load
        this.animateLogoOnLoad();
        
        // Logo interaction animations
        this.setupLogoAnimations();
    }

    animateLogoOnLoad() {
        const headerLogo = document.querySelector('.logo-image');
        if (headerLogo) {
            setTimeout(() => {
                headerLogo.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    headerLogo.style.transform = 'scale(1)';
                }, 200);
            }, 500);
        }
    }

    setupLogoAnimations() {
        const brandLogo = document.querySelector('.brand-logo');
        const heroLogoBg = document.querySelector('.hero-logo-bg');
        
        // Brand logo hover animation
        if (brandLogo) {
            brandLogo.addEventListener('mouseenter', () => {
                this.createLogoHoverEffect(brandLogo);
            });
        }
        
        // Hero background logo scroll animation
        if (heroLogoBg) {
            this.setupHeroLogoParallax(heroLogoBg);
        }
    }

        createLogoHoverEffect(logoElement) {
        const logo = logoElement.querySelector('.logo-image');
        if (!logo) return;

        // Create subtle glow effect
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--clr-primary-400), var(--clr-accent-400));
            border-radius: var(--radius-s);
            opacity: 0;
            z-index: -1;
            filter: blur(4px);
            animation: logoGlow 0.3s ease forwards;
        `;

        logoElement.style.position = 'relative';
        logoElement.appendChild(glow);

        setTimeout(() => glow.remove(), 300);
    }

    setupHeroLogoParallax(heroLogo) 
    {
        if (!heroLogo) 
            return;

        const updateLogoParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1;
            const opacity = Math.max(0.02, 0.08 - scrolled * 0.0001);
            
            heroLogo.style.transform = `translate(-50%, -50%) translateY(${rate}px) rotate(${scrolled * 0.02}deg)`;
            heroLogo.style.opacity = opacity;
        };

        window.addEventListener('scroll', updateLogoParallax);
    }

    // Counter animation
    animateCounter(element) {
        const target = element.textContent.match(/\d+/)?.[0];
        if (!target) return;

        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = element.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 16);
    }

    // Enhanced hover effect with theme awareness
    createHoverEffect(card) {
        const particles = [];
        const numParticles = 8;
        const particleColor = this.currentTheme === 'dark' 
            ? 'hsl(40, 90%, 75%)' 
            : 'hsl(40, 85%, 68%)';

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${particleColor};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                box-shadow: 0 0 8px ${particleColor}66;
            `;

            const rect = card.getBoundingClientRect();
            particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            particle.style.top = (rect.top + Math.random() * rect.height) + 'px';

            document.body.appendChild(particle);
            particles.push(particle);

            // Animate particle with golden glow
            particle.animate([
                { 
                    transform: 'translateY(0) scale(0)', 
                    opacity: 1,
                    filter: 'brightness(1)'
                },
                { 
                    transform: 'translateY(-40px) scale(1)', 
                    opacity: 0.8,
                    filter: 'brightness(1.5)'
                },
                { 
                    transform: 'translateY(-60px) scale(0.5)', 
                    opacity: 0,
                    filter: 'brightness(2)'
                }
            ], {
                duration: 1200,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }

    // Play button animation with new color scheme
    triggerPlayAnimation(button) {
        button.style.transform = 'scale(0.95)';
        button.style.background = 'hsl(345, 70%, 48%)';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.background = '';
        }, 150);

        // Enhanced ripple effect with accent color
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, hsla(345, 65%, 58%, 0.4), hsla(40, 85%, 68%, 0.3));
            transform: scale(0);
            animation: ripple 0.8s ease-out;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 120%;
            height: 120%;
            margin-left: -60%;
            margin-top: -60%;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);

        console.log('Play button clicked - would start game preview');
    }

    // Enhanced ripple effect for service items
    addRippleEffect(item) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                transparent, 
                hsla(215, 35%, 45%, 0.08), 
                hsla(40, 85%, 68%, 0.05),
                transparent);
            pointer-events: none;
            animation: shimmer 2s ease-in-out;
            border-radius: inherit;
        `;

        item.style.position = 'relative';
        item.appendChild(ripple);

        setTimeout(() => ripple.remove(), 2000);
    }

    // Enhanced parallax with theme-aware header updates
    setupParallax() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const scrollPercent = scrolled / (document.body.scrollHeight - window.innerHeight);
            
            // Parallax for hero visual cards with color shift
            document.querySelectorAll('.visual-card').forEach((card, index) => {
                const rate = scrolled * -0.3 * (index + 1);
                const opacity = Math.max(0.8, 1 - scrollPercent * 0.3);
                card.style.transform = `translateY(${rate}px)`;
                card.style.opacity = opacity;
            });

            // Update header background with theme awareness
            this.updateHeaderBackground();

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Keyboard navigation for cards
        document.querySelectorAll('.project-card, .service-item').forEach(card => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Focus management for mobile nav
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav-list');

        navToggle?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navList.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-active');
            }
        });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }

        // Announce theme changes to screen readers
        window.addEventListener('themechange', (e) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            announcement.textContent = `Switched to ${e.detail.theme} mode`;
            
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        });
    }
}

// Enhanced CSS Animations with logo support
const additionalStyles = `
    @keyframes themeRipple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes shimmer {
        0% { 
            transform: translateX(-100%); 
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% { 
            transform: translateX(100%); 
            opacity: 0;
        }
    }

    .nav-open {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--clr-surface-elevated);
        backdrop-filter: blur(12px);
        padding: var(--space-m);
        border-radius: 0 0 var(--radius-l) var(--radius-l);
        box-shadow: var(--shadow-l);
        z-index: 100;
        border: 1px solid var(--clr-border-primary);
        border-top: none;
    }

    .nav-active {
        overflow: hidden;
    }

    .nav-toggle[aria-expanded="true"] span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
        background: var(--clr-text-secondary);
    }

    .nav-toggle[aria-expanded="true"] span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle[aria-expanded="true"] span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
        background: var(--clr-text-secondary);
    }

    /* Enhanced focus states with theme awareness */
    .btn:focus-visible {
        outline: 2px solid var(--clr-border-focus);
        outline-offset: 2px;
    }

    .nav-link:focus-visible {
        outline: 2px solid var(--clr-border-focus);
        outline-offset: 2px;
        background-color: var(--clr-surface-secondary);
    }

    .theme-toggle:focus-visible {
        outline: 2px solid var(--clr-border-focus);
        outline-offset: 2px;
        background-color: var(--clr-surface-secondary);
    }

    /* Subtle glow effects that adapt to theme */
    .visual-card:hover {
        box-shadow: 
            var(--shadow-l),
            0 0 20px var(--clr-gold-400)40;
    }

    .play-button:hover {
        box-shadow: 
            var(--shadow-m),
            0 0 16px var(--clr-accent-400)40;
    }

    .service-icon:hover {
        box-shadow: 
            var(--shadow-m),
            0 0 12px var(--clr-primary-400)40;
    }

    /* Theme transition for smooth switching */
    body,
    .header,
    .theme-toggle {
        transition: background-color 0.3s ease, 
                   color 0.3s ease, 
                   border-color 0.3s ease,
                   box-shadow 0.3s ease !important;
    }

    /* Container query fallback classes */
    .container-sm .hero-title {
        font-size: var(--fs-700) !important;
    }

    .container-sm .portfolio-grid {
        grid-template-columns: 1fr !important;
    }

    .container-sm .project-card.featured {
        grid-column: span 1 !important;
    }

    /* Enhanced loading animation with theme support */
    body.loading {
        opacity: 0;
        background: var(--clr-surface-primary);
    }
    
    .logo-loaded {
        animation: logoLoadSuccess 0.3s ease;
    }
    
    @keyframes logoLoadSuccess {
        0% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .logo-fallback {
        transition: all 0.3s ease;
    }
    
    .logo-fallback:hover {
        transform: scale(1.05);
    }
    
    /* Enhanced mobile logo styles */
    @media (max-width: 480px) {
        .brand-logo {
            min-width: 2.5rem;
        }
        
        .footer-logo {
            justify-content: center;
        }
    }
`;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Inject additional styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);

    // Initialize the app
    new GameStudioApp();

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // Add back to home button for privacy page
    if (window.location.pathname === '/privacy') {
        const privacyPolicy = document.querySelector('.privacy-policy');
        if (privacyPolicy) {
            const backButton = document.createElement('button');
            backButton.className = 'btn btn-outline';
            backButton.style.marginBottom = 'var(--space-l)';
            backButton.textContent = '← Back to Home';
            backButton.addEventListener('click', () => {
                window.location.href = '/';
            });
            privacyPolicy.insertBefore(backButton, privacyPolicy.firstChild);
        }
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}
