// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Page Progress
function updateProgress() {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scroll / height) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

// Chapter Indicator
const chapters = [
    { id: 'intro', title: 'Chapter 1: The Beginning' },
    { id: 'about', title: 'Chapter 2: The Character' },
    { id: 'skills', title: 'Chapter 3: The Arsenal' },
    { id: 'projects', title: 'Chapter 4: The Adventures' },
    { id: 'contact', title: 'The Final Chapter' }
];

function updateChapter() {
    // Cache elements and measurements once
    const viewportCenter = window.scrollY + window.innerHeight / 2;
    const bufferZone = 50; // Pixel buffer for section activation
    const indicator = document.querySelector('.chapter-indicator');
    
    if (!indicator) return; // Safety check
    
    // Find the first chapter that meets the criteria
    const activeChapter = chapters.find(chapter => {
        const section = document.getElementById(chapter.id);
        if (!section) return false; // Skip missing sections
        
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionBottom = sectionTop + rect.height;
        
        // Check if viewport center is within section (with buffer)
        return (viewportCenter >= sectionTop - bufferZone) && 
               (viewportCenter <= sectionBottom + bufferZone);
    });

    // Only update DOM if changed
    if (activeChapter && indicator.textContent !== activeChapter.title) {
        indicator.textContent = activeChapter.title;
        
        // Optional: Add visual feedback
        indicator.classList.add('chapter-change');
        setTimeout(() => indicator.classList.remove('chapter-change'), 200);
    }
}

// Optimized event listeners
let isTicking = false;
function handleScroll() {
    if (!isTicking) {
        requestAnimationFrame(() => {
            updateChapter();
            isTicking = false;
        });
        isTicking = true;
    }
}

// Initialize with Intersection Observer for better performance
function initChapterObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateChapter();
            }
        });
    }, {
        rootMargin: '0px 0px -50% 0px', // Trigger when center passes
        threshold: 0.1
    });

    chapters.forEach(chapter => {
        const section = document.getElementById(chapter.id);
        if (section) observer.observe(section);
    });
}

// Usage: Call initChapterObserver() instead of direct scroll listeners

// Parallax Effect
document.querySelectorAll('.parallax-bg').forEach(bg => {
    gsap.to(bg, {
        scrollTrigger: {
            trigger: bg.parentElement,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top'
        },
        y: '20%'
    });
});

// Skill Bars Animation
document.querySelectorAll('.skill-item').forEach(item => {
    const level = item.dataset.level;
    gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        '--level': `${level}%`,
        duration: 1.5,
        ease: 'power2.out'
    });
});

// Custom Page Transitions
function initPageTransitions() {
    const pages = document.querySelectorAll('.page');
    
    pages.forEach((page, index) => {
        // Create unique animation for each page
        gsap.from(page, {
            scrollTrigger: {
                trigger: page,
                start: 'top center',
                end: 'bottom center',
                toggleActions: 'play reverse play reverse',
                onEnter: () => animatePageElements(page, true),
                onLeave: () => animatePageElements(page, false),
                onEnterBack: () => animatePageElements(page, true),
                onLeaveBack: () => animatePageElements(page, false)
            }
        });
    });
}

// Animate Page Elements
function animatePageElements(page, entering) {
    const elements = page.querySelectorAll('.animate-element');
    const timeline = gsap.timeline();

    elements.forEach((element, index) => {
        const delay = index * 0.2;
        
        if (entering) {
            // Entry animations
            timeline.from(element, {
                duration: 1,
                opacity: 0,
                y: 100,
                rotation: 10,
                scale: 0.8,
                ease: "elastic.out(1, 0.7)",
                delay: delay
            });
        } else {
            // Exit animations
            timeline.to(element, {
                duration: 0.5,
                opacity: 0,
                y: -50,
                scale: 0.9,
                ease: "back.in(1.7)",
                delay: delay
            });
        }
    });
}

// Enhanced Page Turn Effect
function createEnhancedPageTurn() {
    const effect = document.querySelector('.page-turn-effect');
    
    const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" }
    });

    timeline
        .to(effect, {
            duration: 0.5,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            rotation: 5,
            scale: 1.1
        })
        .to(effect, {
            duration: 0.5,
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            rotation: 0,
            scale: 1
        });

    return timeline;
}

// 3D Card Effect
function init3DCards() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(card, {
                duration: 0.5,
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.1,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
}

// Floating Elements Animation
function initFloatingElements() {
    const elements = document.querySelectorAll('.float-element');
    
    elements.forEach((element, index) => {
        gsap.to(element, {
            y: '20px',
            rotation: index % 2 === 0 ? 5 : -5,
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.2
        });
    });
}

// Scroll-triggered Parallax
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach(element => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                toggleActions: 'play reverse play reverse'
            },
            y: '50%',
            scale: 1.2,
            rotation: 5,
            ease: "none"
        });
    });
}

// Text Animation
function initTextAnimations() {
    const textElements = document.querySelectorAll('.animate-text');
    
    textElements.forEach(text => {
        // Split text into characters
        const chars = text.textContent.split('');
        text.textContent = '';
        
        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            text.appendChild(span);
        });

        gsap.from(text.children, {
            scrollTrigger: {
                trigger: text,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            rotation: 90,
            stagger: 0.05,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    });
}

// Initialize
window.addEventListener('scroll', () => {
    updateProgress();
    updateChapter();
});

window.addEventListener('load', () => {
    initPageTransitions();
    init3DCards();
    initFloatingElements();
    initParallaxEffects();
    initTextAnimations();
   

    function initAnimations() {
        const elementToAnimate = document.querySelector('.animate-me');
        if (!elementToAnimate) return;
    
        let startTime = null;
        let rafId = null;
        const duration = 2000; // Animation duration in ms
        const distance = 200; // Pixels to move
    
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const position = distance * progress;
            elementToAnimate.style.transform = `translateX(${position}px)`;
    
            if (progress < 1) {
                rafId = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(rafId);
                // Optional: Trigger completion callback
            }
        }
    
        rafId = requestAnimationFrame(animate);
    
        // Cleanup on window unload
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(rafId);
        });
    }

    initInteractions();
});

// Form Submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Magical button effects
document.querySelectorAll('.magical-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Remove all cursor-related code and add these enhanced interactions
function initInteractions() {
    // Enhanced hover effects for project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Magical button effects
    document.querySelectorAll('.magical-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Typewriter effect
const typewriter = document.querySelector('.typewriter');
const text = typewriter.textContent;
typewriter.textContent = '';

let i = 0;
function type() {
    if (i < text.length) {
        typewriter.textContent += text.charAt(i);
        i++;
        setTimeout(type, 100);
    }
}

// Start typing when the page loads
window.addEventListener('load', type);

// Active navigation link highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Message sent successfully!');
    contactForm.reset();
});

// Add particle system
function createParticleSystem() {
    const particles = document.createElement('div');
    particles.className = 'particles';
    document.body.appendChild(particles);

    for (let i = 0; i < 50; i++) {
        createParticle(particles);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 20 + 10;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}vw;
        top: ${y}vh;
        animation: float ${duration}s infinite;
        background: rgba(108, 99, 255, ${Math.random() * 0.3});
        border-radius: 50%;
        position: absolute;
    `;
    
    container.appendChild(particle);
}

// Add magnetic effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        btn.style.transform = `translate3d(${deltaX * 10}px, ${deltaY * 10}px, 0) scale(1.1)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Add 3D card effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.05, 1.05, 1.05)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Add floating elements
function addFloatingElements() {
    const container = document.createElement('div');
    container.className = 'floating-elements';
    document.body.appendChild(container);
    
    for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = `${Math.random() * 100}vw`;
        element.style.top = `${Math.random() * 100}vh`;
        element.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(element);
    }
}

// Initialize everything
window.addEventListener('load', () => {
    createParticleSystem();
    addFloatingElements();
    // ... existing initialization code
});

// Update the send message handler
document.getElementById('sendMessage').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validate form
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Show loading state
    const button = this;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening email...';
    button.disabled = true;

    try {
        // Format email message
        const emailSubject = encodeURIComponent('New Portfolio Contact Message');
        const emailBody = encodeURIComponent(`
Name: ${name}
Email: ${email}

Message:
${message}
        `);

        // Create and open mailto link
        window.location.href = `mailto:fluffielisa36@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        setTimeout(() => {
            alert('Email app opened successfully!');
        }, 1000);
    } catch (error) {
        // Show error message
        alert('Failed to open email app. Please try again.');
        console.error('Error:', error);
    } finally {
        // Restore button state
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
});

// Add skill hover effect
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('mousemove', (e) => {
        const rect = skill.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        skill.style.setProperty('--mouse-x', `${x}%`);
        skill.style.setProperty('--mouse-y', `${y}%`);
    });
});

// Remove all mousemove and hover effects
document.querySelectorAll('.project-card').forEach(card => {
    // Remove all transform effects
});

// Wait for DOM first
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    card?.addEventListener('mouseleave', resetCardStyles);
});

function resetCardStyles() {
    this.style.transform = 'none';
    this.style.transition = 'all 0.3s ease';
}

// Remove or comment out these event listeners
document.querySelectorAll('.project-card').forEach(card => {
    // Remove all mousemove handlers
    card.removeAttribute('style');
});

// Add ambient lighting effect
document.querySelectorAll('.project-card, .hero-image img, .skill, .form-group, .social-links a, .btn').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        element.style.setProperty('--mouse-x', `${x}%`);
        element.style.setProperty('--mouse-y', `${y}%`);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const rangeElement = document.getElementById('yearRange');
    if (rangeElement) {
        const baseYear = 2024;
        const currentYear = new Date().getFullYear();
        rangeElement.textContent = 
            currentYear > baseYear 
            ? `${baseYear}-${currentYear}` 
            : baseYear.toString();
    }
});

// Project Filtering - Simplified and Fixed
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Show all projects initially
    projectCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            console.log('Filter clicked:', filterValue); // Debug log

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                console.log('Card category:', cardCategory); // Debug log

                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Make sure the DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', initProjectFilters);

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.progress-bar');

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.dataset.progress;
            entry.target.style.width = `${progress}%`;
        }
    });
}, observerOptions);

skillBars.forEach(bar => observer.observe(bar)); 
