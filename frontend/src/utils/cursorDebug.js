// cursorDebug.js
// Development-only helper that, when enabled, highlights the topmost element under
// the cursor and logs the top 3 elements under the pointer. Disabled by default.

function getTopElementsAtPoint(x, y, depth = 3) {
  const elements = document.elementsFromPoint(x, y) || [];
  return elements.slice(0, depth);
}

function createOutline(el, color = 'magenta') {
  const prev = el.__cursorDebugOutline;
  if (prev) return prev;
  const outline = document.createElement('div');
  outline.style.position = 'absolute';
  outline.style.pointerEvents = 'none';
  outline.style.border = `2px dashed ${color}`;
  outline.style.borderRadius = '6px';
  outline.style.zIndex = '9999999';
  outline.style.transition = 'all 120ms ease';
  document.body.appendChild(outline);
  el.__cursorDebugOutline = outline;
  return outline;
}

function updateOutlineForElement(el, outline) {
  if (!el || !outline) return;
  const rect = el.getBoundingClientRect();
  outline.style.left = `${rect.left + window.scrollX - 6}px`;
  outline.style.top = `${rect.top + window.scrollY - 6}px`;
  outline.style.width = `${rect.width + 12}px`;
  outline.style.height = `${rect.height + 12}px`;
}

export function enableCursorDebug(options = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const cfg = Object.assign({ logDepth: 3, color: 'magenta' }, options);
  let lastTop = null;
  let outline = null;

  function onMove(e) {
    try {
      const x = e.clientX;
      const y = e.clientY;
      const tops = getTopElementsAtPoint(x, y, cfg.logDepth);
      if (tops.length) {
        const top = tops[0];
        if (top !== lastTop) {
          // clean up previous outline
          if (outline && lastTop && lastTop.__cursorDebugOutline) {
            // reuse same outline element
            updateOutlineForElement(top, lastTop.__cursorDebugOutline);
            outline = lastTop.__cursorDebugOutline;
          } else {
            outline = createOutline(top, cfg.color);
            updateOutlineForElement(top, outline);
          }
          lastTop = top;
        } else if (outline) {
          updateOutlineForElement(lastTop, outline);
        }
      }

      if (cfg.log) {
        console.log('[cursorDebug] top elements:', tops.map(t => ({ tag: t.tagName, classes: t.className, id: t.id }))); 
      }
    } catch (err) {
      // swallow errors - dev only
      // eslint-disable-next-line no-console
      console.warn('[cursorDebug] error', err);
    }
  }

  window.addEventListener('mousemove', onMove, { passive: true });

  return function disable() {
    window.removeEventListener('mousemove', onMove);
    if (outline && outline.parentNode) outline.parentNode.removeChild(outline);
    if (lastTop && lastTop.__cursorDebugOutline) {
      try { lastTop.__cursorDebugOutline.remove(); } catch (e) {}
      delete lastTop.__cursorDebugOutline;
    }
  };
}

export default enableCursorDebug;
