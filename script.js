document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('wax-seal');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicPlayer = document.getElementById('music-player');
    const musicToggle = document.getElementById('music-toggle');
    const musicWave = document.getElementById('music-wave');
    const playIcon = musicToggle.querySelector('.play-icon');
    const pauseIcon = musicToggle.querySelector('.pause-icon');
    const letterParagraphs = document.querySelectorAll('#letter-text p');
    


    // --- State Variables ---
    let musicPlaying = false;

    // --- Envelope & Intro Logic ---
    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent duplicate triggers
        openEnvelope();
    });

    envelope.addEventListener('click', openEnvelope);

    function openEnvelope() {
        if (envelope.classList.contains('opened')) return;
        
        envelope.classList.add('opened');
        
        // Start background music (user interaction allows autoplay now)
        playMusic();

        // Reveal the main content with a delay matching envelope animation
        setTimeout(() => {
            envelopeOverlay.classList.add('fade-out');
            mainContent.classList.add('main-content-visible');
            musicPlayer.classList.remove('music-player-hidden');
            
            // Trigger paragraph fade-in animations sequentially
            revealLetter();
        }, 1600);
    }

    function revealLetter() {
        letterParagraphs.forEach((p, index) => {
            setTimeout(() => {
                p.classList.add('show');
            }, index * 350); // 350ms delay between paragraphs for smoother reading flow
        });
    }

    // --- Audio Player Logic ---
    function playMusic() {
        bgMusic.play().then(() => {
            musicPlaying = true;
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            musicWave.classList.add('playing');
        }).catch(err => {
            console.log('Audio autoplay prevented:', err);
        });
    }

    function pauseMusic() {
        bgMusic.pause();
        musicPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        musicWave.classList.remove('playing');
    }

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // --- Live Counter ---
    // Start date: 16 June 2023
    const startDate = new Date('2023-06-16T00:00:00');

    function updateCounter() {
        const now = new Date();
        const diffMs = now - startDate;

        if (diffMs < 0) return; // Guard against time discrepancies

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        document.getElementById('count-days').textContent = String(diffDays).padStart(2, '0');
        document.getElementById('count-hours').textContent = String(diffHours).padStart(2, '0');
        document.getElementById('count-minutes').textContent = String(diffMinutes).padStart(2, '0');
        document.getElementById('count-seconds').textContent = String(diffSeconds).padStart(2, '0');
    }

    // Update immediately and then every second
    updateCounter();
    setInterval(updateCounter, 1000);

    // --- Collage Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const collageItems = document.querySelectorAll('.collage-item');

    collageItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.collage-img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('visible');
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        setTimeout(() => {
            if (!lightbox.classList.contains('visible')) {
                lightboxImg.src = '';
            }
        }, 400);
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) {
                closeLightbox();
            }
        });
    }



    // --- Floating Particles Canvas ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    // Load background asset images
    const imgSchafi = new Image();
    imgSchafi.src = 'assets/schafi.png';
    const imgHasi = new Image();
    imgHasi.src = 'assets/hasi.png';
    const imgDandy = new Image();
    imgDandy.src = 'assets/dandy.png';
    const assetImages = [imgSchafi, imgHasi, imgDandy];

    let particles = [];
    const maxParticles = 55; // More particles for falling effect

    class Particle {
        constructor(isInitial = false) {
            this.isInitial = isInitial;
            this.reset();
            if (isInitial) {
                // Spread out vertically at first so they don't all drop from the top together
                this.y = Math.random() * canvas.height;
            }
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = this.isInitial ? Math.random() * canvas.height : -Math.random() * 150 - 50;
            this.isInitial = false; // Reset flag

            this.type = Math.random() > 0.2 ? 'image' : 'heart'; // 80% images, 20% hearts
            
            if (this.type === 'image') {
                this.image = assetImages[Math.floor(Math.random() * assetImages.length)];
                this.size = Math.random() * 40 + 40; // 40px to 80px for images (larger)
                this.opacity = Math.random() * 0.3 + 0.55; // 0.55 to 0.85 opacity (higher visibility)
            } else {
                this.size = Math.random() * 8 + 6; // 6px to 14px for hearts
                this.opacity = Math.random() * 0.3 + 0.15;
            }

            this.speedY = Math.random() * 0.7 + 0.4; // gentle falling speed
            this.speedX = Math.random() * 0.3 - 0.15; // slight drift
            this.angle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.01 + 0.005;
            
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.015 - 0.0075;
        }

        update() {
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.angle += this.swaySpeed;
            this.x += Math.sin(this.angle) * 0.35 + this.speedX; // Gentle sway wave + drift

            // Reset when going off screen
            if (this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;

            if (this.type === 'image') {
                if (this.image.complete && this.image.naturalWidth !== 0) {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
                } else {
                    // Fallback circle if image is loading
                    ctx.fillStyle = '#B76E79';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                ctx.fillStyle = '#B76E79';
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                this.drawHeart(0, 0, this.size);
            }
            ctx.restore();
        }

        drawHeart(x, y, size) {
            const offsetX = -size / 2;
            const offsetY = -size / 2;
            ctx.beginPath();
            ctx.moveTo(offsetX + x, offsetY + y + size / 4);
            ctx.quadraticCurveTo(offsetX + x, offsetY + y, offsetX + x + size / 2, offsetY + y);
            ctx.quadraticCurveTo(offsetX + x + size, offsetY + y, offsetX + x + size, offsetY + y + size / 4);
            ctx.quadraticCurveTo(offsetX + x + size, offsetY + y + size / 2, offsetX + x + size / 2, offsetY + y + size * 0.8);
            ctx.quadraticCurveTo(offsetX + x, offsetY + y + size / 2, offsetX + x, offsetY + y + size / 4);
            ctx.closePath();
            ctx.fill();
        }
    }

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle(true));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    // Handle resizing beautifully
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    initParticles();
    animateParticles();
});
