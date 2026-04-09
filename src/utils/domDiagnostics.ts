/**
 * DOM Diagnostics Utility
 * 
 * Provides automated UI quality assurance by monitoring the DOM for:
 * 1. Text overlaps (bounding box intersections)
 * 2. Section overflows (breaching the 100vh lock)
 * 3. Snap alignment (scroll settling verification)
 */

export const runDiagnostics = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.log("%c[SYSTEM_DIAGNOSTICS] Initializing UI_QA protocols...", "color: #FACC15; font-weight: bold;");

  const checkOverlaps = () => {
    const textElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a'));
    const rects = textElements.map(el => ({
      el,
      rect: el.getBoundingClientRect()
    })).filter(item => item.rect.width > 0 && item.rect.height > 0);

    for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
            const r1 = rects[i].rect;
            const r2 = rects[j].rect;

            // Basic intersection check
            const overlap = !(r1.right < r2.left || 
                              r1.left > r2.right || 
                              r1.bottom < r2.top || 
                              r1.top > r2.bottom);

            if (overlap) {
                // Ignore nested elements or elements in different stacking contexts if necessary
                if (rects[i].el.contains(rects[j].el) || rects[j].el.contains(rects[i].el)) continue;
                
                // Potential false positive check: check for opacity or hidden
                const style1 = window.getComputedStyle(rects[i].el);
                const style2 = window.getComputedStyle(rects[j].el);
                if (style1.opacity === '0' || style2.opacity === '0' || style1.display === 'none' || style2.display === 'none') continue;

                console.warn(`%c[UI_WARN] Potential Text Overlap: "${rects[i].el.textContent?.substring(0, 20)}..." and "${rects[j].el.textContent?.substring(0, 20)}..."`, "color: #ff4444;");
            }
        }
    }
  };

  const checkOverflows = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        // Skip sections with intentional internal scroll
        if (section.classList.contains('allow-internal-scroll')) return;
        
        // Skip check on mobile (< 768px) where we intentionally allow internal scaling
        if (window.innerWidth < 768) return;
        
        const clientHeight = section.clientHeight;
        const scrollHeight = section.scrollHeight;
        
        if (scrollHeight > clientHeight + 5) { // 5px buffer for rounding errors
            console.error(`%c[UI_ERROR] Section Overflow Breach: <section id="${section.id}"> spans ${scrollHeight}px (Max: ${clientHeight}px)`, "color: #ff4444; font-weight: bold;");
        }
    });
  };

  const checkSnap = () => {
    let timeout: any;
    window.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const scrollPos = window.scrollY;
            const viewportH = window.innerHeight;
            const isAligned = Math.round(scrollPos % viewportH) < 5 || Math.round(scrollPos % viewportH) > viewportH - 5;
            
            if (!isAligned) {
                console.warn(`%c[UI_WARN] Snap Alignment Failure: Settlement at ${scrollPos}px (Viewport: ${viewportH}px)`, "color: #FFA500;");
            }
        }, 500);
    });
  };

  // Run periodic checks
  const monitor = setInterval(() => {
    checkOverlaps();
    checkOverflows();
  }, 3000);

  checkSnap();

  return () => clearInterval(monitor);
};
