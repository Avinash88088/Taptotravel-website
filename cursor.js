// ============================================
// Magic Cursor Implementation
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.id = 'magic-cursor';
    const cursorDot = document.createElement('div');
    cursorDot.id = 'magic-cursor-dot';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    // Initial state
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant update for the small dot
        dotX = mouseX;
        dotY = mouseY;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    });

    // Smooth animation loop for the trailing circle
    const animateCursor = () => {
        const speed = 0.2; // Delay factor

        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Interactive Elements Hover Effect
    const interactiveSelectors = 'a, button, .btn, .step-card, .feature-card, .partner-card, input, textarea, .faq-question';
    const interactiveElements = document.querySelectorAll(interactiveSelectors);

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorDot.classList.add('hovered');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorDot.classList.remove('hovered');
        });
    });

    // Click Effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        cursorDot.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        cursorDot.classList.remove('clicking');
    });

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Re-apply to dynamically added elements (simple observer)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                document.querySelectorAll(interactiveSelectors).forEach(el => {
                    // Remove old listeners to avoid duplicates (simplified)
                    // Ideally we'd check if listener exists, but for this scale it's okay to just re-add logic 
                    // or rely on event delegation. For now, let's use delegation for new elements.
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Event Delegation for better performance with dynamic elements
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.add('hovered');
            cursorDot.classList.add('hovered');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.remove('hovered');
            cursorDot.classList.remove('hovered');
        }
    });
});
