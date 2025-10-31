// Dev-only overlay/debug helper
// Usage:
//  - Enable simple logging: add ?overlayDebug=1 to the URL or set window.__OVERLAY_DEBUG__ = true
//  - Enable automatic temporary fix (sets pointer-events:none on visible fixed inset-0 elements):
//      add ?overlayFix=1 or set window.__OVERLAY_FIX__ = true
// This file is only imported in development from main.jsx.

function isVisible(el) {
  if (!el) return false;
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function scanFixedInset0() {
  // matches many backdrops: fixed inset-0 and similar
  const nodes = Array.from(document.querySelectorAll('.fixed.inset-0, [style*="position: fixed"][style*="top: 0"][style*="left: 0"]'));
  // Deduplicate nodes
  return nodes.filter(Boolean);
}

export default async function enableOverlayDebug({ fix = false, log = true, outlineColor = 'magenta' } = {}) {
  try {
    if (typeof document === 'undefined') return;
    // small delay to allow initial mounts
    await new Promise(res => setTimeout(res, 150));

    const nodes = scanFixedInset0();
    const reported = [];
  let _fixedApplied = false;
  nodes.forEach((el, i) => {
      try {
        const cs = getComputedStyle(el);
        const visible = isVisible(el);
        const z = cs.zIndex || 'auto';
        const info = {
          index: i,
          tag: el.tagName.toLowerCase(),
          classes: el.className && el.className.baseVal ? el.className.baseVal : el.className,
          visible,
          zIndex: z,
          pointerEvents: cs.pointerEvents,
          bounds: el.getBoundingClientRect()
        };
        reported.push(info);

        if (log) {
          // eslint-disable-next-line no-console
          console.groupCollapsed(`[overlayDebug] fixed inset-0 #${i} — visible: ${visible} z:${z}`);
          // eslint-disable-next-line no-console
          console.log(info, el);
          // eslint-disable-next-line no-console
          console.groupEnd();
        }

        if (visible && fix) {
          // mark so we can revert if needed
          el.__overlayDebug_origPointerEvents = el.style.pointerEvents;
          el.style.pointerEvents = 'none';
          el.style.outline = `2px dashed ${outlineColor}`;
          el.style.outlineOffset = '2px';
          _fixedApplied = true;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[overlayDebug] scan error', e);
      }
    });

    if (reported.length === 0 && log) {
      // eslint-disable-next-line no-console
      console.log('[overlayDebug] no fixed inset-0 candidates found');
    }

    // return a small API to revert changes
    const handle = {
      reported,
      revert() {
        (reported || []).forEach((r, idx) => {
          const el = document.querySelectorAll('.fixed.inset-0')[idx];
          if (el && el.__overlayDebug_origPointerEvents !== undefined) {
            el.style.pointerEvents = el.__overlayDebug_origPointerEvents;
            el.style.outline = '';
            delete el.__overlayDebug_origPointerEvents;
          }
        });
        try {
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('overlay-debug-uncovered');
          }
        } catch (e) {
          /* ignore */
        }
      }
    };

    try {
      // If we applied fixes, add a helpful class so dev CSS can surface the footer
      if (_fixedApplied && typeof document !== 'undefined') {
        document.documentElement.classList.add('overlay-debug-uncovered');
      }
      // Expose handle for interactive debugging in the console
      // so you can call `window.__OVERLAY_DEBUG_HANDLE__.revert()` to undo temporary fixes
      if (typeof window !== 'undefined') window.__OVERLAY_DEBUG_HANDLE__ = handle;
    } catch (e) {
      // ignore
    }

    return handle;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[overlayDebug] failed to run', err);
    return { reported: [] };
  }
}

// Named helper to match cursorDebug import style
export { enableOverlayDebug as enable };
