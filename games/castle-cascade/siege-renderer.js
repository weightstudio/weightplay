const COLORS = ["#ff6276", "#55baff", "#ffdf62", "#6fec9b", "#d89aff"];
const clamp = value => Math.max(0, Math.min(1, value));

export function siegeLayout(w, h) {
  const landscape = w > h * 1.25;
  const size = Math.min(landscape ? w * .56 : w, landscape ? h : h / 1.58) * .946;
  const board = { x: landscape ? w - size - w * .014 : (w - size) / 2,
    y: landscape ? (h - size) / 2 : h - size - size * .014, size };
  const field = landscape
    ? { x: 3, y: 4, w: board.x - 12, h: h - 8 }
    : { x: board.x, y: 4, w: size, h: board.y - 14 };
  return { board, field };
}

export function siegeTargetPoint(field, target) {
  const size = siegeTargetSize(field, target);
  return { x: field.x + target.x * field.w,
    y: field.y + 32 + size * .62 + target.y * Math.max(0, field.h - 40 - size * 1.12) };
}

function siegeTargetSize(field, target) {
  return Math.min(field.w * (target.kind === "keep" ? .33 : .27), Math.max(24, field.h - 38) * .86);
}

function rounded(ctx, x, y, w, h, radius) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
}

export function drawSiegeField(renderer, field, time) {
  const ctx = renderer.context, siege = renderer.siege;
  if (!siege || field.w <= 0 || field.h <= 0) return;
  ctx.save();
  rounded(ctx, field.x, field.y, field.w, field.h, 14);
  const bg = ctx.createLinearGradient(0, field.y, 0, field.y + field.h);
  bg.addColorStop(0, "#254f55"); bg.addColorStop(.4, "#578968"); bg.addColorStop(1, "#98ad73");
  ctx.fillStyle = bg; ctx.fill(); ctx.clip();
  // Quiet perspective paving keeps the attack/target silhouettes dominant.
  for (let row = 0; row < 5; row += 1) for (let col = 0; col < 7; col += 1) {
    ctx.fillStyle = (row + col) % 2 ? "#dddb9630" : "#1d58451a";
    ctx.fillRect(field.x + col * field.w / 7, field.y + field.h * (.24 + row * .16), field.w / 7 - 1, field.h * .16 - 1);
  }
  ctx.fillStyle = "#173e48cc"; ctx.fillRect(field.x, field.y, field.w, 25);
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.font = "700 12px system-ui"; ctx.fillStyle = "#fff1c9";
  ctx.fillText(renderer.siegeLabels?.wave?.(siege.wave + 1, siege.totalWaves) || `${siege.wave + 1} / ${siege.totalWaves}`, field.x + 10, field.y + 13);
  for (let i = 0; i < siege.totalWaves; i += 1) {
    ctx.beginPath(); ctx.arc(field.x + field.w - 12 - (siege.totalWaves - i - 1) * 13, field.y + 13, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = i <= siege.wave ? "#ffe3a3" : "#8fb2ad"; ctx.fill();
  }
  const motion = renderer.motion;
  const elapsed = motion ? time - motion.started : 0;
  const entrance = ["entrance", "siege-wave"].includes(motion?.kind) ? clamp(elapsed / 340) : 1;
  for (const target of [...siege.targets].sort((a, b) => a.y - b.y)) {
    const hits = motion?.siege?.attacks.filter(shot => shot.targetId === target.id && shot.played) || [];
    const last = hits.at(-1);
    const hitTime = last ? elapsed - last.arrival : Infinity;
    const recoil = hitTime < 220 ? Math.sin(clamp(hitTime / 220) * Math.PI) : 0;
    const dying = target.hp === 0;
    if (dying && (!last || hitTime > 300)) continue;
    const point = siegeTargetPoint(field, target);
    const size = siegeTargetSize(field, target);
    const lift = (1 - entrance) * 16;
    ctx.save();
    ctx.globalAlpha = entrance * (dying ? 1 - clamp(hitTime / 300) : 1);
    ctx.translate(point.x, point.y + lift);
    ctx.rotate(recoil * (dying ? .12 : .04));
    const sy = 1 - recoil * .065;
    ctx.scale(1 + recoil * .06, sy);
    const asset = renderer.assets[target.kind === "sentinel" ? "sentinel" : target.kind === "keep" ? "keep" : "tower"];
    if (asset?.complete && asset.naturalWidth) ctx.drawImage(asset, -size / 2, -size * .56, size, size);
    if (recoil > .05) {
      ctx.globalCompositeOperation = "screen"; ctx.globalAlpha *= recoil * .7;
      ctx.fillStyle = last.blocked ? "#7fd3ff" : "#ffe3ac";
      rounded(ctx, -size * .28, -size * .2, size * .56, size * .48, 8); ctx.fill();
    }
    ctx.restore();
    if (!dying) {
      const barW = size * .87, barH = Math.max(14, Math.min(18, field.h * .1));
      const bx = point.x - barW / 2, by = point.y - size * .61;
      ctx.fillStyle = "#162e41"; rounded(ctx, bx - 2, by - 2, barW + 4, barH + 4, 5); ctx.fill();
      ctx.fillStyle = "#e7c580"; rounded(ctx, bx - 1, by - 1, barW + 2, barH + 2, 4); ctx.fill();
      ctx.fillStyle = "#273f4a"; rounded(ctx, bx, by, barW, barH, 3); ctx.fill();
      ctx.fillStyle = target.kind === "armor" ? "#73b8e7" : target.hp / target.maxHp < .3 ? "#ef7952" : "#8cdb7d";
      rounded(ctx, bx + 1, by + 1, Math.max(0, (barW - 2) * target.hp / target.maxHp), barH - 2, 2); ctx.fill();
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `900 ${barH - 1}px system-ui`;
      ctx.lineWidth = 3; ctx.strokeStyle = "#163745"; ctx.strokeText(String(target.hp), point.x, by + barH / 2);
      ctx.fillStyle = "#fff9e5"; ctx.fillText(String(target.hp), point.x, by + barH / 2);
      if (target.color !== null) renderer.drawSprite(target.color, point.x, point.y + size * .38, size * .25);
      const protectedKeep = target.kind === "keep" && siege.targets.some(item => item.kind === "sentinel" && item.hp > 0);
      if (target.kind === "armor" || protectedKeep) {
        ctx.save(); ctx.translate(point.x + size * .3, point.y + size * .12);
        ctx.fillStyle = protectedKeep ? "#ffe0a0" : "#b5eeff"; ctx.strokeStyle = "#254d67"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(10, -12); ctx.lineTo(9, 2); ctx.lineTo(0, 10); ctx.lineTo(-9, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#365a7a"; ctx.beginPath(); ctx.moveTo(2, -9); ctx.lineTo(-5, 0); ctx.lineTo(0, 0); ctx.lineTo(-2, 6); ctx.lineTo(6, -3); ctx.lineTo(1, -3); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
  }
  ctx.restore();
}

export function prepareVolley(siege, onContact, deliveryDelay = 0) {
  if (!siege?.attacks.length) return {};
  const attacks = siege.attacks.map((shot, index) => {
    const delay = index * 35 + (shot.delivery ? deliveryDelay : 0);
    return { ...shot, delay, arrival: 380 + delay, played: false };
  });
  return { siege: { ...siege, attacks }, onSiegeContact: onContact, siegeDuration: Math.max(...attacks.map(shot => shot.arrival)) + 300 };
}

export function applySiegeContacts(renderer, motion, elapsed) {
  for (const shot of motion?.siege?.attacks || []) {
    if (shot.played || elapsed < shot.arrival) continue;
    shot.played = true;
    const target = renderer.siege?.targets.find(item => item.id === shot.targetId);
    if (target) target.hp = shot.hpAfter;
    if (renderer.siege) renderer.siege.defeated = motion.siege.before.defeated + renderer.siege.targets.filter(item => item.hp === 0 && motion.siege.before.targets.find(before => before.id === item.id)?.hp > 0).length;
    motion.onSiegeContact?.(shot);
  }
}

export function drawSiegeVolley(renderer, bounds, field, motion, time) {
  if (!motion?.siege) return;
  const ctx = renderer.context, elapsed = time - motion.started;
  const cell = bounds.size / 9;
  ctx.save();
  for (const shot of motion.siege.attacks) {
    const target = motion.siege.before.targets.find(item => item.id === shot.targetId);
    const end = siegeTargetPoint(field, target);
    const start = { x: bounds.x + (shot.index % 9 + .5) * cell, y: bounds.y + (Math.floor(shot.index / 9) + .5) * cell };
    const p = clamp((elapsed - shot.delay) / 380);
    const color = COLORS[shot.color] || COLORS[2];
    if (elapsed < shot.delay) continue;
    if (p < 1) {
      const at = t => ({ x: start.x + (end.x - start.x) * t + Math.sin(t * Math.PI) * (shot.power ? 30 : -18),
        y: start.y + (end.y - start.y) * t - Math.sin(t * Math.PI) * 35 });
      const eased = p * p * (3 - 2 * p), point = at(eased);
      ctx.lineCap = "round";
      for (let layer = 0; layer < 3; layer += 1) {
        ctx.beginPath();
        for (let i = 0; i <= 12; i += 1) { const v = at(Math.max(0, eased - .2 + i / 12 * .2)); i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y); }
        ctx.strokeStyle = layer === 2 ? "#fff9dc" : color;
        ctx.globalAlpha = layer === 0 ? .2 : .9;
        ctx.lineWidth = (shot.power ? 12 : 7) * (1 - layer * .34); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.fillStyle = "#fffbe0"; ctx.shadowColor = color; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(point.x, point.y, shot.power ? 5.5 : 3.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    } else {
      const age = clamp((elapsed - shot.arrival) / 300);
      if (age >= 1) continue;
      ctx.globalAlpha = 1 - age; ctx.strokeStyle = shot.blocked ? "#b3e7ff" : color;
      ctx.lineWidth = shot.combo ? 5 : 2.5;
      ctx.beginPath(); ctx.arc(end.x, end.y, 5 + age * (shot.combo ? 40 : 25), 0, Math.PI * 2); ctx.stroke();
      if (!shot.blocked) for (let i = 0; i < (shot.hpAfter === 0 ? 12 : 6); i += 1) {
        const angle = i * 2.399, distance = age * (shot.combo ? 45 : 30);
        ctx.fillStyle = i % 2 ? color : "#fff0bd";
        const s = (shot.hpAfter === 0 ? 6 : 3) * (1 - age * .5);
        ctx.fillRect(end.x + Math.cos(angle) * distance - s / 2, end.y + Math.sin(angle) * distance + age * age * 20, s, s);
      }
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `900 ${shot.combo ? 23 : 18}px system-ui`;
      const label = shot.blocked ? renderer.siegeLabels?.blocked || "0" : `−${shot.damage}`;
      ctx.lineWidth = 3; ctx.strokeStyle = "#23394b"; ctx.strokeText(label, end.x, end.y - 12 - age * 23);
      ctx.fillStyle = shot.blocked ? "#b3e7ff" : "#fff0b8"; ctx.fillText(label, end.x, end.y - 12 - age * 23);
    }
  }
  ctx.restore();
}
