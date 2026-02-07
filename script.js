// Toggle Bio Dossier
const bioBtn = document.getElementById('toggle-bio-btn');
const fullBio = document.getElementById('full-bio');

// Hacker Scramble Effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
function scrambleText(element, finalString) {
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = finalString
            .split("")
            .map((letter, index) => {
                if (index < iterations) return finalString[index];
                return letters[Math.floor(Math.random() * 46)];
            })
            .join("");
        if (iterations >= finalString.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30);
}

if (bioBtn) {
    bioBtn.addEventListener('click', () => {
        if (fullBio.style.display === 'none') {
            fullBio.style.display = 'block';
            fullBio.style.animation = 'slideDown 0.5s ease-out';
            bioBtn.innerHTML = '<i class="fas fa-times"></i> '; // Keep icon
            scrambleText(bioBtn.appendChild(document.createTextNode("")), " CLOSE SECURE DOSSIER");
            bioBtn.lastChild.textContent = " CLOSE SECURE DOSSIER"; // Fallback/Fill
            openTab('tab-bio'); // Default tab
        } else {
            fullBio.style.display = 'none';
            bioBtn.innerHTML = '<i class="fas fa-terminal"></i> ';
            scrambleText(bioBtn.appendChild(document.createTextNode("")), " ACCESS FULL DOSSIER");
        }
    });
}

// Tab Switching Logic
function openTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.dossier-tab').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active-tab');
    });

    // Deactivate all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const tab = document.getElementById(tabId);
    if (tab) tab.style.display = 'block';

    // Activate clicked button
    const clickedBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId));
    if (clickedBtn) clickedBtn.classList.add('active');
}

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

if (lightbox && lightboxImg) {
    // Open Lightbox (Event Delegation for dynamic items)
    document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.gallery-card')) {
            lightboxImg.src = e.target.src;
            lightbox.classList.add('active');
        }
    });

    // Close Lightbox (Click anywhere)
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
}

// Video Modal Variables
const videoModal = document.getElementById('video-modal');
const youtubeFrame = document.getElementById('youtube-frame');
const videoUrl = "https://www.youtube.com/embed/mregw138N68?autoplay=1";

function openVideoModal() {
    if (videoModal && youtubeFrame) {
        videoModal.style.display = 'flex';
        youtubeFrame.src = videoUrl;
    }
}

function closeVideoModal() {
    if (videoModal && youtubeFrame) {
        videoModal.style.display = 'none';
        youtubeFrame.src = ""; // Stop video
    }
}

// Close on outside click for video
if (videoModal) {
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
}

// Terminal logic remains for visual effect only
const terminalOutput = document.getElementById('terminal-output');
if (terminalOutput) {
    const commands = [
        { cmd: "init_protocol --silent", output: "[INFO] AI Engine Loaded in 12ms" },
        { cmd: "subfinder -d target.com -silent", output: "[+] 147 subdomains enumerated" },
        { cmd: "httpx -l subs.txt -sc -title", output: "[*] 22 alive | 5 exposed panels found" },
        { cmd: "nuclei -t cves/ -l alive.txt", output: "[!] CRITICAL: CVE-2024-XXXX detected on api.target.com" },
        { cmd: "gen_payload --xss --context=polyglot", output: "[>] Payload: &lt;svg/onload=alert(1)&gt; generated" }
    ];

    let cmdIndex = 0;

    function typeLine() {
        if (cmdIndex >= commands.length) {
            cmdIndex = 0;
            terminalOutput.innerHTML = ''; // Reset for loop
        }

        const command = commands[cmdIndex];

        const cmdLine = document.createElement('div');
        cmdLine.className = 'line';
        cmdLine.innerHTML = `<span class="prompt">➜</span> <span class="cmd">${command.cmd}</span>`;
        terminalOutput.appendChild(cmdLine);

        // Fast typing simulation
        setTimeout(() => {
            const outLine = document.createElement('div');
            outLine.className = 'line info';
            if (command.output.includes("CRITICAL")) outLine.classList.add("warn");
            if (command.output.includes("Payload")) outLine.classList.add("success");

            outLine.innerHTML = command.output;
            terminalOutput.appendChild(outLine);

            // Auto scroll
            terminalOutput.scrollTop = terminalOutput.scrollHeight;

            cmdIndex++;
            // Much faster delay between commands (800ms vs 2000ms)
            setTimeout(typeLine, 1200);
        }, 400); // Faster output appearance
    }

    // Start terminal effect
    setTimeout(typeLine, 500);
}

// Scroll to Demo Section and Auto-Play
function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
        // Optional: Auto-play the inline video after scrolling
        setTimeout(() => {
            playInlineDemo();
        }, 1000);
    }
}

// Inline Video Player Logic (Facade Pattern) - REFACTORED FOR MULTIPLE VIDEOS
function playInlineDemo(containerId, videoId) {
    // Default fallback if no args provided (for safety)
    const targetContainer = containerId ? document.getElementById(containerId) : document.getElementById('demo-player');
    const targetVideo = videoId || "mregw138N68";

    if (!targetContainer) return;

    // Check if already playing to prevent reload
    if (targetContainer.querySelector('iframe')) return;

    targetContainer.innerHTML = `
        <iframe width="100%" height="100%"
            src="https://www.youtube.com/embed/${targetVideo}?autoplay=1&rel=0"
            title="Rohith AI Security Demo"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </iframe>
    `;
}

// HERO SLIDER LOGIC
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    const slideInterval = 5000;
    let slideTimer;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startTimer() { slideTimer = setInterval(nextSlide, slideInterval); }
    function resetTimer() { clearInterval(slideTimer); startTimer(); }

    if (slides.length > 0) {
        nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => { showSlide(idx); resetTimer(); });
        });
        startTimer();
    }
}
document.addEventListener('DOMContentLoaded', initSlider);

// SYSTEM INFILTRATION & MATRIX EFFECT
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeMatrix() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);

// AI NEURAL NETWORK ANIMATION
const particles = [];
const particleCount = 100;
const connectionDistance = 150;

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateAI() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();

        particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animateAI);
}

window.addEventListener('resize', () => {
    resizeMatrix();
    initParticles();
});

initParticles();
animateAI();

// TERMINAL BOOT SEQUENCE
const bootText = document.getElementById('boot-text');
const messages = [
    '> ESTABLISHING SECURE CONNECTION...',
    '> BYPASSING FIREWALL [####################] 100%',
    '> TARGET IDENTIFIED: ROHITH S',
    '> VULNERABILITY FOUND: PORTFOLIO_ACCESS',
    '> WAITING FOR USER INPUT...'
];
let msgIndex = 0;

function typeWriter(text, i, fn) {
    if (i < text.length) {
        bootText.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1, fn), 30);
    } else if (fn) setTimeout(fn, 500);
}

function startBoot() {
    if (msgIndex < messages.length) {
        bootText.innerHTML += '<div>';
        typeWriter(messages[msgIndex], 0, () => {
            bootText.innerHTML += '</div>';
            msgIndex++;
            startBoot();
        });
    } else {
        // Ready for unlock
        document.addEventListener('wheel', unlockSystem);
        document.addEventListener('click', unlockSystem);
        document.addEventListener('touchstart', unlockSystem);
    }
}

let unlocked = false;
function unlockSystem() {
    if (unlocked) return;
    unlocked = true;
    document.getElementById('boot-text').style.display = 'none';
    const accessMsg = document.getElementById('access-msg');
    accessMsg.style.display = 'block';

    setTimeout(() => {
        document.getElementById('intro-overlay').classList.add('unlocked');
    }, 1000);
}

startBoot();

// CYBER CLICK LISTENER
document.addEventListener('click', (e) => {
    const el = document.createElement('div');
    el.classList.add('click-ripple');
    el.style.left = e.pageX + 'px';
    el.style.top = e.pageY + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
});

// ROBUST CUSTOM CURSOR LOGIC
document.addEventListener('DOMContentLoaded', () => {
    // Remove existing cursor if any
    const oldCursor = document.querySelector('.custom-cursor');
    if (oldCursor) oldCursor.remove();

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to all interactive elements
    const interactiveSelectors = 'a, button, input, textarea, .clickable, .nav-link, .slide';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Observer for dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                document.querySelectorAll(interactiveSelectors).forEach(el => {
                    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
