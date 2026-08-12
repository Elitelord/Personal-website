// Pure rigid-fragment integrator — no DOM, no React, so it can be asserted in
// Node. The renderer only reads x/y/rot off each fragment and writes a
// transform; all behaviour lives here.

export const PHYSICS = {
  gravity: 3200, // px/s²
  drag: 0.992, // velocity retained per 1/60s
  restitution: 0.34, // bounce off walls/floor/ceiling
  friction: 0.72, // tangential loss on floor contact
  impulse: 2100, // blast strength at the origin
  falloff: 240, // px — distance over which impulse decays
  upwardBias: 320, // pushes pieces into an arc rather than sliding
  spin: 7, // rad/s at full jitter
  sleepBelow: 26, // px/s — below this on the floor, stop integrating
};

/** Deterministic when handed a seeded rng, which is what the tests do. */
export function seedFragment(rect, blast, rng = Math.random) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;

  let dx = cx - blast.x;
  let dy = cy - blast.y;
  const dist = Math.hypot(dx, dy) || 1;
  dx /= dist;
  dy /= dist;

  // Closer to the blast means a harder shove.
  const power = PHYSICS.impulse / (1 + dist / PHYSICS.falloff);
  const jitter = 0.65 + rng() * 0.7;

  return {
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    vx: dx * power * jitter + (rng() - 0.5) * 140,
    vy: dy * power * jitter - PHYSICS.upwardBias * (0.4 + rng() * 0.8),
    rot: 0,
    vrot: (rng() - 0.5) * 2 * PHYSICS.spin,
    asleep: false,
  };
}

/**
 * Advances one fragment by `dt` seconds inside `bounds` ({ w, h }).
 * Mutates for speed — there is one object per fragment per detonation and it is
 * never shared.
 */
export function step(f, dt, bounds) {
  if (f.asleep) return f;

  f.vy += PHYSICS.gravity * dt;

  // Frame-rate independent drag.
  const damp = Math.pow(PHYSICS.drag, dt * 60);
  f.vx *= damp;
  f.vy *= damp;

  f.x += f.vx * dt;
  f.y += f.vy * dt;
  f.rot += f.vrot * dt;

  const maxX = Math.max(0, bounds.w - f.w);
  const maxY = Math.max(0, bounds.h - f.h);

  if (f.x < 0) {
    f.x = 0;
    f.vx = -f.vx * PHYSICS.restitution;
    f.vrot = -f.vrot * 0.6;
  } else if (f.x > maxX) {
    f.x = maxX;
    f.vx = -f.vx * PHYSICS.restitution;
    f.vrot = -f.vrot * 0.6;
  }

  if (f.y < 0) {
    f.y = 0;
    f.vy = -f.vy * PHYSICS.restitution;
  } else if (f.y > maxY) {
    f.y = maxY;
    f.vy = -f.vy * PHYSICS.restitution;
    // Scrubbing along the floor bleeds off horizontal speed and spin.
    f.vx *= PHYSICS.friction;
    f.vrot *= PHYSICS.friction;

    if (
      Math.abs(f.vy) < PHYSICS.sleepBelow &&
      Math.abs(f.vx) < PHYSICS.sleepBelow
    ) {
      f.vx = 0;
      f.vy = 0;
      f.vrot = 0;
      f.asleep = true;
    }
  }

  return f;
}

export function stepAll(fragments, dt, bounds) {
  for (let i = 0; i < fragments.length; i++) step(fragments[i], dt, bounds);
  return fragments;
}

/** Total kinetic-ish energy — used by the tests to prove nothing gains energy. */
export function energy(fragments) {
  let sum = 0;
  for (const f of fragments) sum += f.vx * f.vx + f.vy * f.vy;
  return sum;
}
