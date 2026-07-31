export function blurActiveElement() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
}

export function waitForKeyboardClose(timeoutMs = 400): Promise<void> {
  return new Promise((resolve) => {
    const viewport = window.visualViewport;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      viewport?.removeEventListener('resize', onResize);
      window.clearTimeout(fallback);
      resolve();
    };

    const onResize = () => {
      if (!viewport) return;
      if (window.innerHeight - viewport.height < 80) {
        finish();
      }
    };

    const fallback = window.setTimeout(finish, timeoutMs);

    if (!viewport) return;

    if (window.innerHeight - viewport.height < 80) {
      window.setTimeout(finish, 50);
      return;
    }

    viewport.addEventListener('resize', onResize);
  });
}

export function blockPointerEvents(durationMs = 450) {
  const previous = document.body.style.pointerEvents;
  document.body.style.pointerEvents = 'none';
  window.setTimeout(() => {
    document.body.style.pointerEvents = previous;
  }, durationMs);
}
