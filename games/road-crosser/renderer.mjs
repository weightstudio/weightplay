import { signalState, nextLanding } from './model.mjs?v=22';
const FRAMES = { runner: [0, 30, 535, 510], car: [535, 90, 505, 450], truck: [1040, 60, 496, 480],
  log: [0, 560, 600, 440], rock: [600, 560, 490, 440], lantern: [1090, 540, 446, 460] };
export function createRenderer(canvas, atlas, terrain, reduced) {
  const ctx = canvas.getContext('2d');
  let width = 1, height = 1, particles = [], reject = null;
  const geometry = () => ({ width, height, rowHeight: height / 9, cellWidth: width / 10 });
  function resize() {
    const box = canvas.getBoundingClientRect(), ratio = Math.min(2, devicePixelRatio || 1);
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function sprite(name, x, y, w, h, flip = false, alpha = 1) {
    const frame = FRAMES[name], fit = Math.min(w / frame[2], h / frame[3]);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
    ctx.drawImage(atlas, ...frame, -frame[2] * fit / 2, -frame[3] * fit / 2, frame[2] * fit, frame[3] * fit); ctx.restore();
  }
  function event(event) {
    if (event.type === 'blocked') reject = { ...event, life: .24 };
    if (['pickup', 'checkpoint', 'impact'].includes(event.type) && !reduced()) {
      const count = event.type === 'checkpoint' ? 24 : 12;
      for (let i = 0; i < count; i++) {
        const angle = i * 2.399, speed = 14 + i % 5 * 9;
        particles.push({ x: event.x / 10 * width, y: (event.row + .5) / 9 * height,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 30,
          life: .6, max: .6, color: event.reason === 'water' ? '#75e1ff' : event.type === 'impact' ? '#ff9a79' : '#ffdc7f' });
      }
      particles = particles.slice(-48);
    }
  }
  function clear() { particles = []; reject = null; }
  function draw(world, dt = 0, aura = false) {
    if (!world) return;
    const rh = height / 9, cw = width / 10;
    ctx.clearRect(0, 0, width, height);
    const textures = [3, 2, 2, 0, 1, 1, 1, 0, 0];
    for (let row = 0; row < 9; row++) {
      const sourceHeight = terrain.naturalHeight / 4;
      const scale = rh / sourceHeight, tileWidth = terrain.naturalWidth * scale;
      const flow = textures[row] === 2 && !reduced() ? (world.time * (row === 1 ? -6 : 7)) % tileWidth : 0;
      for (let x = -tileWidth + flow; x < width; x += tileWidth) ctx.drawImage(terrain, 0, textures[row] * sourceHeight,
        terrain.naturalWidth, sourceHeight, x, row * rh, tileWidth, rh + .5);
      ctx.fillStyle = textures[row] === 1 ? '#07162944' : '#071f2a26'; ctx.fillRect(0, row * rh, width, rh);
      ctx.fillStyle = '#d1f1df24'; ctx.fillRect(0, row * rh, width, 1);
    }
    // Gates and route markers use the same actual lantern art as pickups.
    for (const x of [.5, 9.5]) sprite('lantern', x * cw, rh * .45, Math.min(42, cw), rh * .75);
    ctx.fillStyle = '#ffde85'; ctx.font = `700 ${Math.max(10, Math.min(14, rh * .3))}px system-ui`;
    ctx.textAlign = 'center'; ctx.fillText(`${world.stage} / 3`, width / 2, rh * .6);
    for (const log of world.logs) {
      const x = log.x * cw, y = (log.row + .5) * rh, w = log.width * cw;
      // Segmented timber keeps visible support equal to simulation support,
      // without stretching the source artwork across a variable river width.
      const unit = Math.min(w, rh * 1.55), count = Math.max(1, Math.ceil(w / unit));
      for (let i = 0; i < count; i++) sprite('log', x - w / 2 + (i + .5) * w / count, y, w / count + 5, rh * .82);
      ctx.strokeStyle = '#edbd6a99'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - w / 2 + 3, y + rh * .19); ctx.lineTo(x + w / 2 - 3, y + rh * .19); ctx.stroke();
    }
    for (const car of world.traffic) {
      const x = car.x * cw, y = (car.row + .5) * rh, w = car.width * cw;
      // The illuminated road footprint is the vehicle's exact occupied width.
      // Keep the artwork proportional at wide, short viewports.
      ctx.fillStyle = car.truck ? '#fd9e563b' : '#57dada30'; ctx.fillRect(x - w / 2, y - rh * .28, w, rh * .56);
      ctx.strokeStyle = car.truck ? '#ffd49c' : '#8df5e4'; ctx.lineWidth = 2;
      ctx.strokeRect(x - w / 2, y - rh * .28, w, rh * .56);
      sprite(car.truck ? 'truck' : 'car', x, y, (car.width + .24) * cw, rh * .97, car.speed > 0);
    }
    for (const rock of world.rocks) {
      ctx.fillStyle = '#ffba7444'; ctx.fillRect((rock.x - .64) * cw, (rock.row + .23) * rh, cw * 1.28, rh * .54);
      sprite('rock', rock.x * cw, (rock.row + .5) * rh, cw * 1.25, rh * .85);
    }
    for (const pickup of world.pickups) if (!pickup.taken) {
      const lift = reduced() ? 0 : Math.sin(world.time * 2 + pickup.id) * 2;
      sprite('lantern', pickup.x * cw, (pickup.row + .5) * rh + lift, Math.min(cw * .7, 32), rh * .7);
    }
    if (world.stage === 3) {
      const stop = signalState(world), y = 5.5 * rh;
      ctx.fillStyle = '#0c2036'; ctx.fillRect(0, y - 13, 26, 26);
      ctx.fillStyle = stop === 'stop' ? '#fb8b7c' : stop === 'warning' ? '#ffd26b' : '#6bf0b7';
      ctx.font = 'bold 15px system-ui'; ctx.fillText(stop === 'stop' ? 'Ⅱ' : stop === 'warning' ? '!' : '→', 13, y + 5);
    }
    const p = world.player;
    if (world.state === 'playing') {
      const next = nextLanding(world), y = (p.row - .5) * rh;
      ctx.strokeStyle = next === 'safe' ? '#b7f6d5' : next === 'blocked' ? '#ffbc75' : '#ff9c8e';
      ctx.lineWidth = 2; ctx.setLineDash(next === 'safe' ? [] : [3, 4]);
      ctx.strokeRect(p.x * cw - cw * .33, y - rh * .23, cw * .66, rh * .46); ctx.setLineDash([]);
    }
    let x = p.x * cw, y = (p.row + .5) * rh, lift = 0;
    if (world.hop && !reduced()) {
      const progress = Math.min(1, world.hop.time / world.hop.duration), eased = 1 - (1 - progress) ** 2;
      x = (world.hop.from.x + (world.hop.to.x - world.hop.from.x) * eased) * cw;
      y = (world.hop.from.row + .5 + (world.hop.to.row - world.hop.from.row) * eased) * rh;
      lift = Math.sin(progress * Math.PI) * Math.min(16, rh * .3);
    }
    const size = Math.min(cw * 1.25, rh * .92, 68);
    if (aura) { const glow = ctx.createRadialGradient(x, y, 2, x, y, size); glow.addColorStop(0, '#b6acff88'); glow.addColorStop(1, '#7affef00'); ctx.fillStyle = glow; ctx.fillRect(x - size, y - size, size * 2, size * 2); }
    ctx.fillStyle = '#0007'; ctx.beginPath(); ctx.ellipse(x, y + size * .3, size * .33, size * .1, 0, 0, Math.PI * 2); ctx.fill();
    const hit = world.state === 'impact', fade = hit && world.reason === 'water' ? 1 - Math.min(1, world.phaseTime / .44) : 1;
    if (hit && !reduced() && world.reason === 'traffic') x += Math.sin(world.phaseTime * 55) * Math.max(0, 4 * (1 - world.phaseTime / .44));
    sprite('runner', x, y - lift, size, size, false, fade);
    if (hit || reject) {
      const rx = reject ? reject.x * cw : x, ry = reject ? (reject.row + .5) * rh : y;
      ctx.strokeStyle = world.reason === 'water' ? '#7de5ff' : '#ffbd85'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(rx, ry, size * .5, 0, Math.PI * 2); ctx.stroke();
    }
    if (reject) { reject.life -= dt; if (reject.life <= 0) reject = null; }
    particles = particles.filter(particle => particle.life > 0);
    for (const particle of particles) {
      particle.life -= dt; particle.x += particle.vx * dt; particle.y += particle.vy * dt; particle.vy += 75 * dt;
      ctx.globalAlpha = Math.max(0, particle.life / particle.max); ctx.fillStyle = particle.color; ctx.fillRect(particle.x, particle.y, 3, 3);
    }
    ctx.globalAlpha = 1;
    if (world.state === 'arriving') { ctx.fillStyle = '#ffdc7622'; ctx.fillRect(0, 0, width, rh); }
  }
  return { resize, draw, event, clear, geometry, sprite };
}
