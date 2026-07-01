/* ============================================================
   Bioluminescent Velvet Theme — main.js
   Scroll-Jacking · Custom Follower · Staggered Typo Reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Scroll State Variables ---
  let activeSlide = 0;
  const totalSlides = 7;
  let isTransitioning = false;
  
  const slides = document.querySelectorAll('.slide');
  const navDots = document.querySelectorAll('#gallery-navigation .nav-dot');
  
  // Custom cursor variables
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouse = { x: 0, y: 0 };
  let dotPos = { x: 0, y: 0 };
  let ringPos = { x: 0, y: 0 };

  // Touch Swipe tracking
  let touchStartY = 0;

  /* ------------------ Custom Cursor Follower ------------------ */
  function initCursor() {
    if (window.innerWidth < 768) return; // skip custom cursor on mobile

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Animate cursor positions with easing lag
    function updateCursor() {
      dotPos.x += (mouse.x - dotPos.x) * 0.18;
      dotPos.y += (mouse.y - dotPos.y) * 0.18;
      
      ringPos.x += (mouse.x - ringPos.x) * 0.08;
      ringPos.y += (mouse.y - ringPos.y) * 0.08;

      if (cursorDot) {
        cursorDot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%)`;
      }
      if (cursorRing) {
        cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      }

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Bind interactive elements to trigger cursor state scales
    const hoverables = 'a, button, input, textarea, .nav-dot, .minimal-project-card, .timeline-block, .skill-category';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active-hover');
      });
    });
  }

  /* ------------------ Slide Transitions (GoTo) ------------------ */
  function changeSlide(targetIndex) {
    if (targetIndex < 0 || targetIndex >= totalSlides || isTransitioning) return;
    if (targetIndex === activeSlide && slides[targetIndex].classList.contains('active-slide')) return;

    isTransitioning = true;

    // Toggle active slide overlays
    slides.forEach((slide, idx) => {
      if (idx === targetIndex) {
        slide.classList.add('active-slide');
      } else {
        slide.classList.remove('active-slide');
      }
    });

    // Reset letters in inactive slides
    slides.forEach((slide, idx) => {
      if (idx !== targetIndex) {
        slide.querySelectorAll('.letter').forEach(el => {
          el.style.transform = 'translateY(100%)';
        });
      }
    });

    // Update Navigation indicator dots active state
    navDots.forEach((dot, idx) => {
      if (idx === targetIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update body slide active class for dynamic CSS colors
    for (let i = 0; i < totalSlides; i++) {
      document.body.classList.remove(`slide-active-${i}`);
    }
    document.body.classList.add(`slide-active-${targetIndex}`);

    // Trigger WebGL morph inside scene.js
    if (typeof window.setSculptureSlide === 'function') {
      window.setSculptureSlide(targetIndex);
    }

    // Trigger Typography Entrance effects
    revealHeadlineLetters(slides[targetIndex]);

    activeSlide = targetIndex;

    // Throttle next scroll event to enforce continuous cinematic feeling
    setTimeout(() => {
      isTransitioning = false;
    }, 1300);
  }

  /* ------------------ Typography Reveal Effects ------------------ */
  function revealHeadlineLetters(activeSlideElement) {
    if (!activeSlideElement) return;

    const headline = activeSlideElement.querySelector('.slide-heading') || activeSlideElement.querySelector('.sculpture-title');
    if (!headline) return;

    if (headline.dataset.splitDone !== 'true') {
      // Split by <br> tags to keep vertical block-level line breaks intact
      const lines = headline.innerHTML.split(/<br\s*\/?>/i);
      headline.innerHTML = '';
      
      lines.forEach((lineText, lineIdx) => {
        const lineContainer = document.createElement('div');
        lineContainer.style.display = 'block';
        lineContainer.style.whiteSpace = 'nowrap'; // avoid breaking words inside lines
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = lineText;
        const cleanText = tempDiv.textContent || '';
        
        const letters = cleanText.split('');
        letters.forEach((char, i) => {
          const wrapperSpan = document.createElement('span');
          wrapperSpan.style.display = 'inline-block';
          wrapperSpan.style.overflow = 'hidden';
          wrapperSpan.style.verticalAlign = 'top';

          const innerSpan = document.createElement('span');
          innerSpan.className = 'letter';
          innerSpan.textContent = char === ' ' ? '\u00A0' : char;
          innerSpan.style.display = 'inline-block';
          innerSpan.style.transform = 'translateY(100%)';
          innerSpan.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          innerSpan.style.transitionDelay = `${(lineIdx * 8 + i) * 25}ms`;

          wrapperSpan.appendChild(innerSpan);
          lineContainer.appendChild(wrapperSpan);
        });
        
        headline.appendChild(lineContainer);
      });
      headline.dataset.splitDone = 'true';
    }

    // Trigger slide-up translation
    setTimeout(() => {
      activeSlideElement.querySelectorAll('.letter').forEach(el => {
        el.style.transform = 'translateY(0)';
      });
    }, 50);
  }

  /* ------------------ Scroll Jacking Routing ------------------ */
  function handleWheel(e) {
    e.preventDefault();
    if (isTransitioning) return;

    if (e.deltaY > 0) {
      if (activeSlide < totalSlides - 1) {
        changeSlide(activeSlide + 1);
      }
    } else {
      if (activeSlide > 0) {
        changeSlide(activeSlide - 1);
      }
    }
  }

  // Bind Wheel event directly as non-passive
  document.addEventListener('wheel', handleWheel, { passive: false });

  function handleTouchStart(e) {
    touchStartY = e.changedTouches[0].screenY;
  }

  function handleTouchEnd(e) {
    if (isTransitioning) return;
    const touchEndY = e.changedTouches[0].screenY;
    const diffY = touchStartY - touchEndY;
    const threshold = 60; // minimum swipe displacement

    if (diffY > threshold) {
      if (activeSlide < totalSlides - 1) {
        changeSlide(activeSlide + 1);
      }
    } else if (diffY < -threshold) {
      if (activeSlide > 0) {
        changeSlide(activeSlide - 1);
      }
    }
  }

  function handleKeydown(e) {
    if (isTransitioning) return;

    if (e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      if (activeSlide < totalSlides - 1) changeSlide(activeSlide + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeSlide > 0) changeSlide(activeSlide - 1);
    }
  }

  /* ------------------ Form Submission Feedback ------------------ */
  function initContactForm() {
    const form = document.querySelector('.minimalist-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.transmit-button');
      if (!submitBtn) return;

      const originalVal = submitBtn.textContent;
      submitBtn.textContent = 'SENDING...';
      submitBtn.style.pointerEvents = 'none';

      // Send form data asynchronously to Formspree
      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          submitBtn.textContent = 'MESSAGE SENT ✓';
          submitBtn.style.background = 'var(--accent-mint)';
          submitBtn.style.color = '#030308';
          submitBtn.style.boxShadow = '0 0 20px var(--accent-mint)';
          form.reset();
        } else {
          submitBtn.textContent = 'ERROR SENDING';
          submitBtn.style.background = 'var(--accent-rose)';
          submitBtn.style.color = '#030308';
          submitBtn.style.boxShadow = '0 0 20px var(--accent-rose)';
        }
      })
      .catch(error => {
        submitBtn.textContent = 'ERROR SENDING';
        submitBtn.style.background = 'var(--accent-rose)';
        submitBtn.style.color = '#030308';
        submitBtn.style.boxShadow = '0 0 20px var(--accent-rose)';
      })
      .finally(() => {
        setTimeout(() => {
          submitBtn.textContent = originalVal;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.style.boxShadow = '';
          submitBtn.style.pointerEvents = 'auto';
        }, 3000);
      });
    });
  }

  /* ------------------ Initialization Core ------------------ */
  function init() {
    // Navigation dot binding clicks
    navDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        changeSlide(idx);
      });
    });

    // Event routing registrations
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeydown);

    initCursor();
    initContactForm();

    // Trigger initial slide typography reveal
    revealHeadlineLetters(slides[0]);
    
    // Set initial body color state
    document.body.classList.add('slide-active-0');
  }

  init();
  console.log('Velvet exhibition controller initialized.');
});
