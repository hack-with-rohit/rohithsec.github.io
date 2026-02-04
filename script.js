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
