/* WeightPlay shared virtual joystick. Load virtual-joystick.css with this file. */
(function (global) {
  'use strict';
  if (global.WeightPlayJoystick) return;

  const VERSION = '1.0.0';
  const RADIUS = 48;
  const INSET = 72;
  const DEAD_ZONE = 0.12;
  const instances = new WeakMap();
  const hosts = new WeakMap();
  const ZERO = Object.freeze({ x: 0, y: 0, strength: 0, active: false });

  function create({ surface, container = surface?.parentElement, mode = 'floating',
    anchor = {}, enabled = true, isEnabled = () => true, onChange = () => {} } = {}) {
    if (!surface?.addEventListener || !container?.appendChild || !container.contains(surface)) {
      throw new TypeError('WeightPlayJoystick requires a surface inside its container');
    }
    if (instances.has(surface)) throw new Error('WeightPlayJoystick already owns this surface');
    if (!['floating', 'fixed'].includes(mode)) throw new TypeError('Joystick mode must be floating or fixed');
    if (typeof isEnabled !== 'function' || typeof onChange !== 'function') throw new TypeError('Joystick callbacks must be functions');
    const left = anchor.left ?? 76, bottom = anchor.bottom ?? 76;
    if (![left, bottom].every(value => Number.isFinite(value) && value >= 0)) throw new TypeError('Joystick anchor must use nonnegative logical pixels');

    const doc = surface.ownerDocument;
    const win = doc.defaultView;
    const base = doc.createElement('div');
    const thumb = doc.createElement('span');
    base.className = 'wp-virtual-joystick';
    thumb.className = 'wp-virtual-joystick-thumb';
    base.setAttribute('aria-hidden', 'true');
    base.dataset.wpJoystick = VERSION;
    base.appendChild(thumb);
    container.appendChild(base);

    let host = hosts.get(container);
    if (!host) {
      host = { count: 0, position: container.style.position, changed: win.getComputedStyle(container).position === 'static' };
      if (host.changed) container.style.position = 'relative';
      hosts.set(container, host);
    }
    host.count++;
    const previousTouchAction = surface.style.touchAction;
    surface.style.touchAction = 'none';

    let pointerId = null, originX = 0, originY = 0, scale = 1;
    let vector = ZERO, destroyed = false, available = Boolean(enabled);
    const removers = [];
    const listen = (target, type, handler, options) => {
      target.addEventListener(type, handler, options);
      removers.push(() => target.removeEventListener(type, handler, options));
    };
    const usable = () => !destroyed && available && !doc.hidden && isEnabled();
    const limit = (value, extent) => extent < INSET * 2 ? extent / 2 : Math.max(INSET, Math.min(extent - INSET, value));
    function measure() {
      const rect = container.getBoundingClientRect();
      scale = rect.width / container.offsetWidth || 1;
      return { left: rect.left + container.clientLeft * scale, top: rect.top + container.clientTop * scale,
        width: container.clientWidth, height: container.clientHeight };
    }
    function position(x, y) {
      base.style.left = `${x}px`;
      base.style.top = `${y}px`;
    }
    function dock() {
      const rect = measure();
      position(limit(left, rect.width), limit(rect.height - bottom, rect.height));
    }
    function publish(x = 0, y = 0, active = false) {
      const strength = Math.hypot(x, y);
      if (vector.x === x && vector.y === y && vector.active === active) return;
      vector = active ? Object.freeze({ x, y, strength, active }) : ZERO;
      onChange(vector);
    }
    function reset() {
      if (destroyed) return;
      const previousPointer = pointerId;
      pointerId = null;
      base.classList.remove('is-held');
      thumb.style.transform = 'translate(0px, 0px)';
      dock();
      base.hidden = !usable();
      // Clear ownership before releasing capture; lostpointercapture may be synchronous.
      try {
        if (previousPointer !== null && surface.hasPointerCapture?.(previousPointer)) surface.releasePointerCapture(previousPointer);
      } finally { publish(); }
    }
    function refresh() {
      if (destroyed) return;
      if (!usable()) { reset(); return; }
      base.hidden = false;
      if (pointerId === null) dock();
    }
    function update(event) {
      if (!usable()) { reset(); return; }
      if (event.cancelable) event.preventDefault();
      const dx = (event.clientX - originX) / scale, dy = (event.clientY - originY) / scale;
      const distance = Math.hypot(dx, dy);
      const strength = Math.max(0, (Math.min(1, distance / RADIUS) - DEAD_ZONE) / (1 - DEAD_ZONE));
      const travel = distance ? Math.min(distance, RADIUS) / distance : 0;
      thumb.style.transform = `translate(${dx * travel}px, ${dy * travel}px)`;
      publish(distance ? dx / distance * strength : 0, distance ? dy / distance * strength : 0, true);
    }
    function down(event) {
      if (!usable() || pointerId !== null || event.isPrimary === false || (event.button ?? 0) !== 0) return;
      // A containing play surface may also host action buttons; leave them to their owner.
      if (event.target?.closest?.('button, a, input, select, textarea, [contenteditable="true"], [role="button"], [data-wp-joystick-ignore]')) return;
      const rect = measure();
      if (rect.width <= 0 || rect.height <= 0) return;
      if (mode === 'fixed') {
        const cx = limit(left, rect.width), cy = limit(rect.height - bottom, rect.height);
        originX = rect.left + cx * scale; originY = rect.top + cy * scale;
        if (Math.hypot(event.clientX - originX, event.clientY - originY) > INSET * scale) return;
        position(cx, cy);
      } else {
        originX = event.clientX; originY = event.clientY;
        position(limit((originX - rect.left) / scale, rect.width), limit((originY - rect.top) / scale, rect.height));
      }
      pointerId = event.pointerId;
      try { surface.setPointerCapture?.(pointerId); }
      catch (error) { reset(); throw error; }
      base.hidden = false;
      base.classList.add('is-held');
      update(event);
    }
    function move(event) { if (pointerId === event.pointerId) update(event); }
    function up(event) { if (pointerId !== null && pointerId === event.pointerId) reset(); }
    const api = Object.freeze({
      element: base,
      getVector() {
        if (!destroyed && !usable()) reset();
        return vector;
      },
      setEnabled(value) {
        if (destroyed) return;
        const next = Boolean(value);
        if (next !== available) { available = next; if (!next) reset(); else refresh(); }
      },
      refresh, reset,
      destroy() {
        if (destroyed) return;
        try { reset(); }
        finally {
          destroyed = true;
          removers.forEach(remove => remove());
          base.remove();
          if (surface.style.touchAction === 'none') surface.style.touchAction = previousTouchAction;
          if (--host.count === 0) {
            if (host.changed && container.style.position === 'relative') container.style.position = host.position;
            hosts.delete(container);
          }
          instances.delete(surface);
        }
      },
    });
    instances.set(surface, api);
    listen(surface, 'pointerdown', down);
    listen(surface, 'pointermove', move);
    listen(surface, 'lostpointercapture', up);
    listen(win, 'pointerup', up, true);
    listen(win, 'pointercancel', up, true);
    for (const type of ['blur', 'pagehide', 'resize', 'orientationchange']) listen(win, type, reset);
    listen(doc, 'visibilitychange', reset);
    if (win.visualViewport) listen(win.visualViewport, 'resize', reset);
    refresh();
    return api;
  }

  global.WeightPlayJoystick = Object.freeze({ version: VERSION, create });
})(window);
