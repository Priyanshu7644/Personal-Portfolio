/* ==========================================
   PORTFOLIO - MAIN JAVASCRIPT
   Interactivity & Animations
   ========================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initNavbar();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initStatCounters();
    initMobileMenu();
    initContactForm();
    initBackToTop();
    initSmoothScroll();
    initHeroScrollFade();
    initCursorGlow();
    initClickRipple();
    initExpandCerts();
    initSidebarDropdown();
});

/* ==========================================
   Navbar Scroll Effect
   ========================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar') || document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect - add background on scroll
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================
   Typing Effect
   ========================================== */
function initTypingEffect() {
    const typingElement = document.getElementById('typingText') || document.querySelector('.stagger-role');
    if (!typingElement) return;
    const roles = [
        'Full Stack Developer',
        'B.Tech CSE Student',
        'React Developer',
        'Problem Solver',
        'Node.js Developer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Deleting characters
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Typing characters
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Check if word is complete
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing effect
    type();
}

/* ==========================================
   Scroll Animations (Intersection Observer)
   ========================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ==========================================
   Skill Bars Animation
   ========================================== */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = `${width}%`;
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

/* ==========================================
   Stat Counter Animation
   ========================================== */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ==========================================
   Mobile Menu
   ========================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (!menuBtn || !navLinks) return;

    const navItems = navLinks.querySelectorAll('.nav-link');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ==========================================
   Contact Form Handling
   ========================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!validateForm(data)) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Send with EmailJS
        emailjs.send('service_4hwxsxf', 'template_ad84gka', {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
        })
            .then(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#10b981';

                showFormSuccess('Message sent successfully!');

                // Reset form
                form.reset();

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            })
            .catch((error) => {
                console.error('FAILED...', error);
                showFormError('Failed to send message. Please try again later.');

                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name || data.name.trim().length < 2) {
        showFormError('Please enter a valid name');
        return false;
    }

    if (!emailRegex.test(data.email)) {
        showFormError('Please enter a valid email address');
        return false;
    }

    if (!data.subject || data.subject.trim().length < 3) {
        showFormError('Please enter a subject');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showFormError('Please enter a message (at least 10 characters)');
        return false;
    }

    return true;
}

function showFormError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showFormSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* ==========================================
   Back to Top Button
   ========================================== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================
   Smooth Scroll for Navigation Links
   ========================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   Hero Scroll Indicator Fade
   ========================================== */
function initHeroScrollFade() {
    const heroScroll = document.getElementById('heroScroll');
    if (!heroScroll) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Fade out completely by 200px of scroll
        const opacity = Math.max(0, 1 - (scrolled / 200));
        heroScroll.style.opacity = opacity;

        // Disable pointer events if fully invisible
        if (opacity === 0) {
            heroScroll.style.pointerEvents = 'none';
        } else {
            heroScroll.style.pointerEvents = 'auto';
        }
    });
}

/* ==========================================
   Parallax Effect for Hero (Optional)
   ========================================== */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

/* ==========================================
   Preloader (Optional Enhancement)
   ========================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/* ==========================================
   Cursor Glow Effect
   ========================================== */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;

    // Initialize glow to be visible
    cursorGlow.style.opacity = '1';

    document.addEventListener('mousemove', (e) => {
        // Offset by half of width/height (300px) to center it on cursor
        cursorGlow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    });
}

/* ==========================================
   Click Ripple Effect
   ========================================== */
function initClickRipple() {
    document.addEventListener('click', function (e) {
        // Create the ripple element
        const ripple = document.createElement('div');
        ripple.classList.add('click-ripple');

        // Size of the ripple
        const size = 20;

        // Position it exactly where the click happened
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - (size / 2)}px`;
        ripple.style.top = `${e.clientY - (size / 2)}px`;

        // Append to body
        document.body.appendChild(ripple);

        // Remove the element after animation completes (600ms)
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

/* ==========================================
   Certifications Expand Logic
   ========================================== */
function initExpandCerts() {
    const expandBtn = document.getElementById('expandCertsBtn');
    const hiddenItems = document.querySelectorAll('.cert-hidden');
    const btnText = document.getElementById('expandCertsText');
    const btnIcon = document.getElementById('expandCertsIcon');

    if (!expandBtn || hiddenItems.length === 0) return;

    let isExpanded = false;

    expandBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        hiddenItems.forEach((item, index) => {
            if (isExpanded) {
                // Timeline items use display: block inherently, so we use block instead of flex to fix width bugs
                item.style.display = 'block';
                // Trigger reflow
                void item.offsetWidth;

                // Determine direction based on index (even = right, odd = left) to match timeline logic
                const direction = index % 2 === 0 ? 'fadeUp' : 'fadeUp';

                item.style.animation = `${direction} 0.5s ease forwards ${(index * 0.1)}s`;
                // Add class animated so the opacity stays 1
                item.classList.add('animated');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            } else {
                item.style.display = 'none';
                item.classList.remove('animated');
            }
        });

        if (isExpanded) {
            btnText.innerText = 'Show Less';
            btnIcon.className = 'fas fa-chevron-up';
        } else {
            btnText.innerText = 'Show More (11)';
            btnIcon.className = 'fas fa-chevron-down';
            // Scroll back to the top of the certifications section
            document.getElementById('certifications').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/* ==========================================
   Sidebar Dropdown Mobile Support
   ========================================== */
function initSidebarDropdown() {
    const dropdownToggle = document.getElementById('eduCertToggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (!dropdownToggle || !dropdownMenu) return;

    // For mobile tap to open/close
    dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.classList.toggle('active');

        // If active, force inline styles to show it on mobile
        if (dropdownMenu.classList.contains('active')) {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
            dropdownMenu.style.transform = 'translateY(-50%) translateX(20px)';
        } else {
            dropdownMenu.style.opacity = '';
            dropdownMenu.style.visibility = '';
            dropdownMenu.style.transform = '';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
            dropdownMenu.style.opacity = '';
            dropdownMenu.style.visibility = '';
            dropdownMenu.style.transform = '';
        }
    });

    // Close dropdown when a sub-item is clicked
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownMenu.classList.remove('active');
            dropdownMenu.style.opacity = '';
            dropdownMenu.style.visibility = '';
            dropdownMenu.style.transform = '';
        });
    });
}

/* ==========================================
   Project Modal Logic
   ========================================== */
const projectData = {
    portfolio: {
        title: "Personal Portfolio Website",
        intro: "A modern, highly interactive portfolio featuring glassmorphism, responsive design, and dynamic themes. Engineered to showcase projects cleanly, emphasizing UI/UX best practices.",
        tech: ["HTML5", "CSS3", "JavaScript", "React.js"],
        github: "https://github.com/Priyanshu7644/Personal-Portfolio",
        live: "#",
        images: [
            "assets/project%20images/my%20portfolio/Screenshot%20(113).png",
            "assets/project%20images/my%20portfolio/Screenshot%20(114).png",
            "assets/project%20images/my%20portfolio/Screenshot%20(115).png"
        ]
    },
    polling: {
        title: "Polling System Application",
        intro: "Full-stack polling platform utilizing Express.js and MongoDB with secure voting and live results. Includes JWT-based authentication, an intuitive dashboard, and an OTP email verification flow.",
        tech: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
        github: "https://github.com/Priyanshu7644/polling-system",
        live: "#",
        images: [
            "assets/project%20images/polling%20system/Screenshot%20(142).png",
            "assets/project%20images/polling%20system/Screenshot%20(143).png",
            "assets/project%20images/polling%20system/Screenshot%20(144).png",
            "assets/project%20images/polling%20system/Screenshot%20(145).png"
        ]
    }
};

let currentProject = null;
let currentImageIndex = 0;

window.openProjectModal = function(projectId) {
    const modal = document.getElementById('projectModal');
    const data = projectData[projectId];
    if (!data || !modal) return;
    
    currentProject = data;
    currentImageIndex = 0;
    
    document.getElementById('modalProjectTitle').innerText = data.title;
    document.getElementById('modalProjectIntro').innerText = data.intro;
    
    // Inject Tech Stack
    const techStack = document.getElementById('modalTechStack');
    techStack.innerHTML = '';
    if (data.tech) {
        data.tech.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.innerText = tech;
            techStack.appendChild(span);
        });
    }

    // Inject Action Links
    const actions = document.getElementById('modalActions');
    actions.innerHTML = `
        <a href="${data.live}" class="btn btn-primary" target="_blank">
            <span>View Live</span>
            <i class="fas fa-external-link-alt"></i>
        </a>
        <a href="${data.github}" class="btn btn-secondary" target="_blank">
            <span>Source Code</span>
            <i class="fab fa-github"></i>
        </a>
    `;
    
    updateModalGallery();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

function updateModalGallery() {
    if (!currentProject) return;
    
    const imgElement = document.getElementById('modalGalleryImage');
    const dotsContainer = document.getElementById('modalGalleryDots');
    
    // Trigger CSS animation reflow
    imgElement.style.animation = 'none';
    void imgElement.offsetHeight; 
    imgElement.style.animation = null; 
    
    imgElement.src = currentProject.images[currentImageIndex];
    
    // Update dots
    dotsContainer.innerHTML = '';
    currentProject.images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'modal-dot ' + (index === currentImageIndex ? 'active' : '');
        dot.onclick = () => {
            currentImageIndex = index;
            updateModalGallery();
        };
        dotsContainer.appendChild(dot);
    });
}

// Attach event listeners for modal
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeProjectModal');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    const modal = document.getElementById('projectModal');
    
    if (closeBtn) closeBtn.addEventListener('click', window.closeProjectModal);
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (!currentProject) return;
        currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
        updateModalGallery();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (!currentProject) return;
        currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
        updateModalGallery();
    });
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-grid') || e.target.classList.contains('modal-gallery-wrapper')) {
                window.closeProjectModal();
            }
        });
    }
});
