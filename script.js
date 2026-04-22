document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
            
            // Hamburger to Close transition
            const spans = menuBtn.querySelectorAll('span');
            if (menuBtn.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 4. Celestial Background (Stars)
    class CelestialBackground {
        constructor() {
            this.canvas = document.getElementById('celestial-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.mouse = { x: 0, y: 0 };
            
            this.init();
            this.animate();
            
            window.addEventListener('resize', () => this.init());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }
        
        init() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.stars = [];
            
            const starCount = window.innerWidth < 768 ? 50 : 150;
            for (let i = 0; i < starCount; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 1.5,
                    opacity: Math.random(),
                    speed: Math.random() * 0.005 + 0.002
                });
            }
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.stars.forEach(star => {
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0) star.speed *= -1;
                
                this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            // Mouse Glow update
            const mouseGlow = document.querySelector('.mouse-glow');
            if (mouseGlow) {
                mouseGlow.style.left = `${this.mouse.x}px`;
                mouseGlow.style.top = `${this.mouse.y}px`;
            }
            
            requestAnimationFrame(() => this.animate());
        }
    }
    
    new CelestialBackground();

    // 5. Smooth Scroll for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. 3D Card Slider Interaction
    const cards = document.querySelectorAll('.card-3d');
    
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                cards.forEach((c, i) => {
                    if (c === card) return;
                    let offset = i - index;
                    if (offset < 0) offset += cards.length;
                    c.style.setProperty('--i', offset);
                });
            });
        });
    }
});
