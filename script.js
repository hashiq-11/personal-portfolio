document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    //  Fetch and Render Dynamic Content (JSON)
    // =====================================================================
    fetch('data.json?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error("JSON not found");
            return response.json();
        })
        .then(data => {
            renderSkills(data.skills);
            renderExperience(data.experience);
            renderProjects(data.projects);
            
            // Initialize dynamic animations AFTER elements exist in DOM
            initCursorAndEffects();
            initScrollObserver();
        })
        .catch(err => {
            console.error("Error loading portfolio data:", err);
            // Fallback initialization so static elements still animate
            initCursorAndEffects();
            initScrollObserver();
        });

    // --- Render Functions ---

    function renderSkills(skills) {
        const container = document.getElementById('skills-container');
        if (!container) return;
        
        container.innerHTML = skills.map(skill => `
            <div class="skill-category">
                <i class="${skill.icon} icon-gold"></i>
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
            </div>
        `).join('');
    }

    function renderExperience(experienceList) {
        const container = document.getElementById('experience-container');
        if (!container) return;
        
        container.innerHTML = experienceList.map(exp => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content box-glow">
                    <span class="date">${exp.date}</span>
                    <h3>${exp.role}</h3>
                    <h4>${exp.company}</h4>
                    <ul>
                        ${exp.points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    function renderProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = projects.map(proj => {
            // Build the tech stack pills
            const stackHtml = proj.stack.map(tech => `<li>${tech}</li>`).join('');
            
            // Build the links 
            let linksHtml = '';
            if (proj.links) {
                if (proj.links.github) linksHtml += `<a href="${proj.links.github}" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>`;
                if (proj.links.youtube) linksHtml += `<a href="${proj.links.youtube}" target="_blank"><i class="fa-brands fa-youtube"></i> YouTube</a>`;
                if (proj.links.play) linksHtml += `<a href="${proj.links.play}" target="_blank"><i class="fa-brands fa-itch-io"></i> Play</a>`;
            }

            return `
                <div class="project-card box-glow" data-tilt>
                    <div class="project-content">
                        <h3>${proj.title}</h3>
                        <p>${proj.description}</p>
                        <ul class="tech-stack">${stackHtml}</ul>
                        <div class="project-links">${linksHtml}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // =====================================================================
    //  Animations & Interactive Effects
    // =====================================================================

    function initCursorAndEffects() {
        // --- 1. Senior UI: 3D Tilt Physics for Cards ---
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Normalized coordinates from -1 to 1 based on center of card
                const xNorm = (x / rect.width) * 2 - 1;
                const yNorm = (y / rect.height) * 2 - 1;

                // Max rotation degree
                const maxRotation = 10;
                
                card.style.transform = `perspective(1000px) rotateX(${-yNorm * maxRotation}deg) rotateY(${xNorm * maxRotation}deg) scale3d(1.02, 1.02, 1.02) translateY(-5px)`;
                
                // Optional: Adjust shine glare if it existed, or box glow
                card.style.boxShadow = `${-xNorm * 10}px ${yNorm * 10}px 30px rgba(0,0,0,0.6), 0 0 20px rgba(184, 160, 126, 0.15)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset smoothly
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease';
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)`;
                card.style.boxShadow = ''; // Reset to CSS default
                
                // Remove transition after it's done so mousemove is snappy again
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
        });

        // --- 2. Senior UI: Magnetic Buttons ---
        const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .social-links a');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Pull element towards cursor with multiplier
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                // Snap back
                btn.style.transform = `translate(0px, 0px)`;
            });
        });

        // --- 3. Senior UI: Parallax Typography Scroll ---
        const parallaxTexts = document.querySelectorAll('.parallax-bg-text');
        if (parallaxTexts.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                parallaxTexts.forEach(text => {
                    const speed = 0.3; // Parallax scalar
                    text.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });
        }

        // Ambient Mouse Glow
        const ambientGlow = document.querySelector('.ambient-glow');
        if(ambientGlow) {
            document.addEventListener('mousemove', (e) => {
                ambientGlow.style.left = e.clientX + 'px';
                ambientGlow.style.top = e.clientY + 'px';
            });
        }
    }

    function initScrollObserver() {
        const fadeElements = document.querySelectorAll('.fade-up, .skill-category, .timeline-item, .project-card');

        fadeElements.forEach(el => {
            if (!el.classList.contains('fade-up')) {
                el.classList.add('fade-up');
            }
        });

        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, appearOptions);

        fadeElements.forEach(el => {
            appearOnScroll.observe(el);
        });

        // Make Hero visible immediately
        const heroElements = document.querySelectorAll('.hero .fade-up');
        heroElements.forEach(el => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 100);
        });
    }

    // =====================================================================
    //  Static UI Logistics (Floating Particles, Nav toggle, etc)
    // =====================================================================

    // Floating Particles
    const canvas = document.getElementById('particles');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(184, 160, 126, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // Typewriter Effect (Hero Subtitle)
    const typewriterEl = document.getElementById('typewriter');
    if(typewriterEl) {
        const phrase = "Engineering clean, scalable mechanics — from procedural geometry tools to open-world racing games.";
        let charIndex = 0;

        function typeChar() {
            if (charIndex < phrase.length) {
                typewriterEl.textContent += phrase.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 35 + Math.random() * 30);
            }
        }
        setTimeout(typeChar, 1500);
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        const navItems = document.querySelectorAll('.nav-links li a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Email Button Interaction
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = "hashiqms@gmail.com";
            
            navigator.clipboard.writeText(email).then(() => {
                const originalText = emailBtn.innerHTML;
                emailBtn.innerHTML = '<i class="fa-solid fa-check"></i>&nbsp; Copied to Clipboard!';
                setTimeout(() => { emailBtn.innerHTML = originalText; }, 3000);
            }).catch(err => console.error("Clipboard copy failed", err));

            window.location.href = `mailto:${email}`;
        });
    }

    // Active Nav Link Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    function highlightNav() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav);
});
