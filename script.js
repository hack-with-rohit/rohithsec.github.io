// --- PARTICLE NETWORK SYSTEM ---
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const mouse = { x: null, y: null };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5 + 1;
        this.color = `rgba(0, 243, 255, ${Math.random() * 0.5 + 0.1})`; // Neon Blue
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 12000); // Density
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();

        // Connect particles
        particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        // Connect to Mouse
        if (mouse.x) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.strokeStyle = `rgba(189, 0, 255, ${0.2 * (1 - dist / 150)})`; // Neon Purple connection
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Initialize Particles
resize();
animateParticles();


// --- LIVE TERMINAL WIDGET ---
const terminalOutput = document.getElementById('terminal-output');
const commands = [
    { text: "target_lock --host=secure.corp.net", type: "cmd" },
    { text: "[*] Resolving DNS... 10.0.4.52 [OK]", type: "info" },
    { text: "[*] Enumerating subdomains via PassiveTotal...", type: "info" },
    { text: "[+] Found: admin.secure.corp.net (200 OK)", type: "success" },
    { text: "[+] Found: api.secure.corp.net (403 FORBIDDEN)", type: "warn" },
    { text: "scout --scan-headers", type: "cmd" },
    { text: "[!] Missing HSTS Header detected", type: "warn" },
    { text: "[!] CSP Policy allows 'unsafe-inline'", type: "warn" },
    { text: "vuln_check --module=mta-sts", type: "cmd" },
    { text: "[*] Analying MTA-STS policy...", type: "info" },
    { text: "[VULN] MTA-STS Policy Missing / Not Enforced!", type: "success" }, // Red/Green depending on context (Red for vuln found)
    { text: "gen_report --format=pdf --dest=./reports", type: "cmd" },
    { text: "[*] Compiling findings...", type: "info" },
    { text: "[SUCCESS] Report generated: report_290126.pdf", type: "success" }
];

let cmdIndex = 0;

function typeTerminal() {
    if (cmdIndex >= commands.length) {
        cmdIndex = 0; // Loop
        terminalOutput.innerHTML = '';
    }

    const cmd = commands[cmdIndex];
    const div = document.createElement('div');
    div.className = 'line';

    if (cmd.type === 'cmd') {
        div.innerHTML = `<span class="prompt">➜</span> <span class="cmd">${cmd.text}</span>`;
    } else {
        const colorClass = cmd.type;
        div.innerHTML = `<span class="${colorClass}">${cmd.text}</span>`;
    }

    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    cmdIndex++;

    // Random Typing Speed
    const delay = cmd.type === 'cmd' ? 800 : Math.random() * 300 + 100;
    setTimeout(typeTerminal, delay);
}

// Start Terminal after 1s
setTimeout(typeTerminal, 1000);

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

bioBtn.addEventListener('click', () => {
    if (fullBio.style.display === 'none') {
        fullBio.style.display = 'block';
        fullBio.style.animation = 'slideDown 0.5s ease-out';
        bioBtn.innerHTML = '<i class="fas fa-times"></i> '; // Keep icon
        scrambleText(bioBtn.appendChild(document.createTextNode("")), " CLOSE SECURE DOSSIER");
        bioBtn.lastChild.textContent = " CLOSE SECURE DOSSIER"; // Fallback/Fill
    } else {
        fullBio.style.display = 'none';
        bioBtn.innerHTML = '<i class="fas fa-terminal"></i> ';
        scrambleText(bioBtn.appendChild(document.createTextNode("")), " ACCESS FULL DOSSIER");
    }
});
