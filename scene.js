(function () {
  'use strict';

  /* ---------- Global Declarations ---------- */
  let scene, camera, renderer;
  let particleGeometry, particleSystem;
  let particleCount = 18000;
  
  // Storage for particle positions & colors across all 6 slides
  let slidePositions = [];
  let slideColors = [];
  
  // Current active morph targets
  let currentPositions, currentColors;
  
  // Interaction variables
  let mouse = { x: 0, y: 0 };
  let targetMouse = { x: 0, y: 0 };
  
  // Camera controller variables
  let currentSlide = 0;
  let cameraTargetPos = new THREE.Vector3(0, 0, 35);
  let cameraTargetLook = new THREE.Vector3(0, 0, 0);
  let currentCameraLook = new THREE.Vector3(0, 0, 0);
  let baseDrift = 0;

  // Slide Camera Presets (Position & LookAt targets)
  const cameraPresets = [
    { pos: new THREE.Vector3(0, 0, 35), look: new THREE.Vector3(0, 0, 0) },      // Slide 0: Hero
    { pos: new THREE.Vector3(18, 5, 25), look: new THREE.Vector3(5, 0, 0) },     // Slide 1: About
    { pos: new THREE.Vector3(-15, 10, 30), look: new THREE.Vector3(-3, 0, 0) },   // Slide 2: Skills
    { pos: new THREE.Vector3(0, -8, 20), look: new THREE.Vector3(0, 0, -5) },    // Slide 3: Projects
    { pos: new THREE.Vector3(-18, 6, 26), look: new THREE.Vector3(-4, 0, 0) },   // Slide 4: Freelance VAPT
    { pos: new THREE.Vector3(20, -5, 28), look: new THREE.Vector3(0, 2, 0) },    // Slide 5: Experience
    { pos: new THREE.Vector3(0, 0, 42), look: new THREE.Vector3(0, 0, 0) }       // Slide 6: Contact
  ];

  // Colors mapping (Accent Hex Values)
  const hexAmber  = 0xffb37b;
  const hexRose   = 0xff6e7f;
  const hexMint   = 0xbaffd9;
  const hexPurple = 0xc5a3ff;
  const hexCyan   = 0x00f3ff;

  /* ---------- Color Helper Functions ---------- */
  function hexToRGB(hex) {
    let r = ((hex >> 16) & 255) / 255;
    let g = ((hex >> 8) & 255) / 255;
    let b = (hex & 255) / 255;
    return new THREE.Color(r, g, b);
  }

  function interpolateColor(color1, color2, factor) {
    return color1.clone().lerp(color2, factor);
  }

  /* ---------- Particle Shape Generator Algorithms ---------- */
  function generateSculptures() {
    for (let s = 0; s < 7; s++) {
      let positions = new Float32Array(particleCount * 3);
      let colors = new Float32Array(particleCount * 3);
      
      let colorA, colorB;
      if (s === 0) { // Hero: Amber & Rose Coral
        colorA = hexToRGB(hexAmber);
        colorB = hexToRGB(hexRose);
      } else if (s === 1) { // About: Rose & Purple Vine
        colorA = hexToRGB(hexRose);
        colorB = hexToRGB(hexPurple);
      } else if (s === 2) { // Skills: Mint & Amber Tree
        colorA = hexToRGB(hexMint);
        colorB = hexToRGB(hexAmber);
      } else if (s === 3) { // Projects: Purple & Cyan Anemone
        colorA = hexToRGB(hexPurple);
        colorB = hexToRGB(hexCyan);
      } else if (s === 4) { // Freelance: Cyan & Mint Knot
        colorA = hexToRGB(hexCyan);
        colorB = hexToRGB(hexMint);
      } else if (s === 5) { // Experience: Rose & Amber Waves
        colorA = hexToRGB(hexRose);
        colorB = hexToRGB(hexAmber);
      } else { // Contact: Mint & Purple Cocoon
        colorA = hexToRGB(hexMint);
        colorB = hexToRGB(hexPurple);
      }

      for (let i = 0; i < particleCount; i++) {
        let x = 0, y = 0, z = 0;
        let factor = i / particleCount;

        if (s === 0) {
          // --- SHAPE 0: HERO (Phyllotaxis Helix-Sphere Coral) ---
          let phi = Math.acos(-1 + (2 * i) / particleCount);
          let theta = Math.sqrt(particleCount * Math.PI) * phi;
          let r = 12 + Math.sin(phi * 8.0) * Math.cos(theta * 6.0) * 3.5;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
          
          // Organic branch-like noise displacement
          x += Math.sin(i * 0.05) * 1.8;
          y += Math.cos(i * 0.03) * 1.8;
          z += Math.sin(i * 0.07) * 1.8;

        } else if (s === 1) {
          // --- SHAPE 1: ABOUT (Helical Coral Vine / Ribbon) ---
          let t = factor * Math.PI * 18;
          let radius = 7 + Math.sin(t * 0.6) * 3.2;
          let side = (i % 2 === 0) ? 1 : -1;
          x = radius * Math.cos(t) * side + Math.sin(i * 0.12) * 1.8;
          y = (factor - 0.5) * 28 + Math.cos(i * 0.09) * 1.8;
          z = radius * Math.sin(t) * side + Math.sin(i * 0.15) * 1.8;

        } else if (s === 2) {
          // --- SHAPE 2: SKILLS (Branching Crystalline Dendrite Tree) ---
          let branch = i % 8;
          let progress = (Math.floor(i / 8) / (particleCount / 8));
          let angle = (branch / 8) * Math.PI * 2;
          let len = progress * 16;
          x = Math.cos(angle) * len + Math.sin(progress * 16 + branch) * 2.2;
          y = Math.sin(angle) * len + Math.cos(progress * 13 + branch) * 2.2;
          z = (Math.random() - 0.5) * 3.5 + Math.sin(progress * 28) * 1.8;

        } else if (s === 3) {
          // --- SHAPE 3: PROJECTS (Bioluminescent Jellyfish / Fluid Anemone) ---
          if (i < particleCount * 0.35) {
            let theta = Math.random() * Math.PI * 2;
            let phi = Math.random() * Math.PI * 0.42;
            let r = 9 + Math.sin(theta * 4) * 1.4;
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.cos(phi) + 4;
            z = r * Math.sin(phi) * Math.sin(theta);
          } else {
            let tentacleId = i % 14;
            let t = Math.random();
            let angle = (tentacleId / 14) * Math.PI * 2;
            let r = 7.5 + Math.sin(t * 8) * 1.2;
            x = r * Math.cos(angle) + Math.sin(t * 14 + tentacleId) * 1.8;
            y = -t * 22 + 4;
            z = r * Math.sin(angle) + Math.cos(t * 11 + tentacleId) * 1.8;
          }

        } else if (s === 4) {
          // --- SHAPE 4: FREELANCE (Torus Knot Wave) ---
          let p = 3;
          let q = 4;
          let t = factor * Math.PI * 2 * 6; // wind 6 times
          let r = 8 + 3.2 * Math.sin(q * t);
          x = r * Math.cos(p * t) + Math.sin(i * 0.15) * 1.5;
          y = r * Math.sin(p * t) + Math.cos(i * 0.12) * 1.5;
          z = 3.2 * Math.cos(q * t) + (Math.random() - 0.5) * 2.5;

        } else if (s === 5) {
          // --- SHAPE 5: EXPERIENCE (Layered Geological Strata) ---
          x = (factor - 0.5) * 38;
          y = Math.sin(x * 0.22) * 5.5 + Math.cos(x * 0.45 + i * 0.01) * 3.2;
          z = Math.sin(i * 0.02) * 8.5 + (Math.random() - 0.5) * 2.2;

        } else {
          // --- SHAPE 6: CONTACT (Dense Luminous Nebula Cocoon) ---
          let theta = Math.random() * Math.PI * 2;
          let phi = Math.acos((Math.random() * 2) - 1);
          let r = 9.5 + (Math.random() - 0.5) * 3.5 + Math.sin(theta * 4) * Math.cos(phi * 4) * 2.2;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        }

        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color blending along the sculpture shapes
        let col = interpolateColor(colorA, colorB, factor + (Math.random() - 0.5) * 0.15);
        colors[i * 3]     = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
      
      slidePositions.push(positions);
      slideColors.push(colors);
    }
  }

  /* ---------- Initialization Routine ---------- */
  function init() {
    let canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040409, 0.018);

    // Camera
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(cameraTargetPos);

    // Build particle shapes
    generateSculptures();

    // Prepare current working particle buffers
    particleGeometry = new THREE.BufferGeometry();
    currentPositions = new Float32Array(slidePositions[0]);
    currentColors = new Float32Array(slideColors[0]);

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(currentColors, 3));

    // Custom Round Particles using Canvas texture
    let pTexture = createParticleTexture();
    let particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Setup listener triggers
    window.addEventListener('resize', onResize);
    document.addEventListener('mousemove', onMouseMove);

    // Kickoff render animation loop
    animate();
  }

  /* ---------- Generate Round Soft Dot Texture ---------- */
  function createParticleTexture() {
    let canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    let ctx = canvas.getContext('2d');
    let grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    let tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /* ---------- Smooth Frame Render Loop ---------- */
  function animate() {
    requestAnimationFrame(animate);

    let time = performance.now() * 0.001;
    baseDrift += 0.0015;

    // Smooth Mouse coordinates tracking
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    // Smooth Morphing interpolation toward target slide positions & colors
    let targetPos = slidePositions[currentSlide];
    let targetCol = slideColors[currentSlide];
    
    let posAttr = particleGeometry.attributes.position;
    let colAttr = particleGeometry.attributes.color;

    // Direct fluid lerping inside vertex buffers
    for (let i = 0; i < particleCount * 3; i++) {
      posAttr.array[i] += (targetPos[i] - posAttr.array[i]) * 0.045;
      colAttr.array[i] += (targetCol[i] - colAttr.array[i]) * 0.045;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Slowly drift / breathe individual particles based on sin waves
    let basePos = posAttr.array;
    for (let j = 0; j < particleCount; j++) {
      let idx = j * 3;
      let wave = Math.sin(time * 0.8 + j * 0.01) * 0.04;
      basePos[idx]     += wave;
      basePos[idx + 1] += Math.cos(time * 0.6 + j * 0.01) * 0.03;
      basePos[idx + 2] += Math.sin(time * 0.9 + j * 0.02) * 0.04;
    }

    // Continuous camera fly-by drift
    let preset = cameraPresets[currentSlide];
    
    // Merge baseline preset coordinates, scroll drift coordinates, and mouse interaction offsets
    let driftX = Math.sin(baseDrift) * 2.2 + mouse.x * 3.5;
    let driftY = Math.cos(baseDrift * 0.8) * 1.8 + mouse.y * 2.5;

    cameraTargetPos.copy(preset.pos).add(new THREE.Vector3(driftX, driftY, 0));
    cameraTargetLook.copy(preset.look).add(new THREE.Vector3(mouse.x * 1.5, mouse.y * 1.5, 0));

    // Linear interpolate camera vectors for maximum stability
    camera.position.lerp(cameraTargetPos, 0.035);
    currentCameraLook.lerp(cameraTargetLook, 0.035);
    camera.lookAt(currentCameraLook);

    // Apply slow global rotation of particles sculpture
    if (particleSystem) {
      particleSystem.rotation.y = time * 0.04;
      particleSystem.rotation.x = Math.sin(time * 0.02) * 0.08;
    }

    // Update Display HUD status reports
    updateHUD(time);

    renderer.render(scene, camera);
  }

  /* ---------- Update Decorative HUD values ---------- */
  function updateHUD(time) {
    let morphEl = document.getElementById('hud-status');
    let camEl = document.getElementById('hud-camera-coords');
    let timeEl = document.getElementById('hud-timer');

    if (timeEl) {
      timeEl.textContent = time.toFixed(3) + 's';
    }

    if (camEl) {
      camEl.textContent = `CAM_X: ${camera.position.x.toFixed(2)} | CAM_Y: ${camera.position.y.toFixed(2)}`;
    }

    if (morphEl) {
      let activePreset = cameraPresets[currentSlide];
      let dist = camera.position.distanceTo(activePreset.pos);
      let syncPercent = Math.max(0, Math.min(100, Math.floor((1.0 - dist / 8.0) * 100)));
      if (dist < 0.1) {
        morphEl.textContent = "STATUS // READY";
      } else {
        morphEl.textContent = `MORPHING // ${syncPercent}%`;
      }
    }
  }

  /* ---------- Slide trigger export ---------- */
  function setSculptureSlide(index) {
    if (index >= 0 && index < 7) {
      currentSlide = index;
    }
  }

  /* ---------- Resize Handler ---------- */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /* ---------- Mouse Interaction listener ---------- */
  function onMouseMove(e) {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  // Self-boot loading
  init();
  
  // Update display HUD resolution parameters initially
  onResize();

  // Export scene interface to global window namespace
  window.setSculptureSlide = setSculptureSlide;

})();
