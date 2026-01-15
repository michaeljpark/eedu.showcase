// Design Showcase Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all showcase items and rows
    const showcaseItems = document.querySelectorAll('.showcase-item, .showcase-row');
    showcaseItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });

    // Lazy load images
    const images = document.querySelectorAll('.showcase-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Image will load when src is set (when actual images are added)
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add smooth scroll behavior for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle image load errors (show placeholder gracefully)
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });

    // Add parallax effect on scroll (subtle)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.showcase-item');

                parallaxElements.forEach((element, index) => {
                    const speed = 0.02;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // Console log for debugging
    console.log('Design showcase loaded successfully');
    console.log(`Total showcase items: ${showcaseItems.length}`);

    // Add a simple counter for loaded items
    let loadedCount = 0;
    showcaseItems.forEach(item => {
        item.addEventListener('animationend', function() {
            loadedCount++;
            if (loadedCount === showcaseItems.length) {
                console.log('All showcase items have been animated');
            }
        });
    });

    // Iframe load handler
    const iframe = document.querySelector('iframe');
    if (iframe) {
        iframe.addEventListener('load', function() {
            console.log('Embedded content loaded successfully');
        });
    }

    // --- Navigation Scroll Spy Logic ---
    const navItems = document.querySelectorAll('.side-nav li');
    const sections = {
        'research': [],
        'design': [],
        'prototyping': [],
        'design-pilot': []
    };

    // Helper to extract number from frame filename
    function getFrameNumber(src) {
        const match = src.match(/Frame-(\d+)\.png/i);
        return match ? parseInt(match[1], 10) : -1;
    }

    // Categorize showcase items
    document.querySelectorAll('.showcase-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            const src = img.getAttribute('src');
            
            // Handle Hero Image explicitly (Frame.png without number)
            if (src.includes('Frame.png')) {
                item.dataset.section = 'intro';
            } else {
                const num = getFrameNumber(src);
                if (num >= 1 && num <= 10) {
                    sections['research'].push(item);
                    item.dataset.section = 'research';
                } else if (num >= 11 && num <= 16) {
                    sections['design'].push(item);
                    item.dataset.section = 'design';
                } else if (num >= 17 && num <= 19) {
                    sections['prototyping'].push(item);
                    item.dataset.section = 'prototyping';
                }
            }
        }
    });

    // Also observe the header as 'intro'
    const header = document.querySelector('header');
    if (header) {
        header.dataset.section = 'intro';
    }

    // Handle "Design Pilot" (last showcase container items)
    const showcaseContainers = document.querySelectorAll('.showcase');
    if (showcaseContainers.length > 1) {
        const lastContainer = showcaseContainers[showcaseContainers.length - 1];
        Array.from(lastContainer.querySelectorAll('.showcase-item')).forEach(item => {
            sections['design-pilot'].push(item);
            item.dataset.section = 'design-pilot';
        });
    }

    // Intersection Observer for Scroll Spy
    const spyOptions = {
        root: null,
        // Trigger line is slightly above center to capture intent early or strictly center
        rootMargin: '-45% 0px -55% 0px', 
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.dataset.section;
                if (sectionId) {
                    updateActiveNav(sectionId);
                }
            }
        });
    }, spyOptions);

    // Observe all categorized items plus intro items
    Object.values(sections).flat().forEach(item => {
        if (item) spyObserver.observe(item);
    });
    // Observe intro items specifically
    document.querySelectorAll('[data-section="intro"]').forEach(item => {
        spyObserver.observe(item);
    });

    function updateActiveNav(id) {
        navItems.forEach(nav => {
            if (id === 'intro') {
                nav.classList.remove('active');
            } else if (nav.dataset.target === id) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    // Click to scroll handling
    navItems.forEach(nav => {
        nav.addEventListener('click', () => {
            const targetId = nav.dataset.target;
            const targetElements = sections[targetId];
            if (targetElements && targetElements.length > 0) {
                targetElements[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});