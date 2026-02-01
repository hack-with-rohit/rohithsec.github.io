
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
const videoUrl = "https://www.youtube.com/embed/mregw138N68?autoplay=1";

function openVideoModal() {
    videoModal.style.display = 'flex';
    youtubeFrame.src = videoUrl;
}

function closeVideoModal() {
    videoModal.style.display = 'none';
    youtubeFrame.src = ""; // Stop video
}

// Close on outside click for video
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Terminal logic remains for visual effect only
const terminalOutput = document.getElementById('terminal-output');
const commands = [
    { cmd: "init_protocol --silent", output: "[INFO] AI Engine Loaded in 20ms" },
    { cmd: "scan_target -u target.com", output: "[+] Scanning ports... 22, 80, 443 open" },
    { cmd: "analyze_vuln --deep", output: "[!] CRITICAL: SQL Injection detected on /login" },
    { cmd: "exploit_db --search CVE-2024", output: "[*] 3 Payloads generated for auto-deployment" }
];

let cmdIndex = 0;

function typeLine() {
    if (cmdIndex >= commands.length) {
        cmdIndex = 0; // Loop (optional) or stop
        terminalOutput.innerHTML = '';
    }

    const command = commands[cmdIndex];

    const cmdLine = document.createElement('div');
    cmdLine.className = 'line';
    cmdLine.innerHTML = `<span class="prompt">➜</span> <span class="cmd">${command.cmd}</span>`;
    terminalOutput.appendChild(cmdLine);

    setTimeout(() => {
        const outLine = document.createElement('div');
        outLine.className = 'line info';
        outLine.innerHTML = command.output;
        terminalOutput.appendChild(outLine);

        // Auto scroll
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        cmdIndex++;
        setTimeout(typeLine, 2000);
    }, 500);
}

// Start terminal effect
setTimeout(typeLine, 1000);

// Inline Video Player Logic (Facade Pattern)
function playInlineDemo() {
    const playerContainer = document.getElementById('demo-player');
    // Check if already playing to prevent reload
    if (playerContainer.querySelector('iframe')) return;

    const videoId = "mregw138N68"; // Your Video ID

    playerContainer.innerHTML = `
        <iframe width="100%" height="100%" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
            title="Rohith AI Security Demo" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </iframe>
    `;

    // Ensure container has aspect ratio respected if needed, 
    // but the CSS handles the container size (height: 400px usually or aspect ratio).
    // Let's force full height usage within the flex container.
}
