export const GAME_ID = 'fluxrail-pinball';
export const SAVE_KEY = 'weightplay_fluxrail_pinball_v1';
export const LESSON_KEY = 'weightplay_fluxrail_pinball_tutorial_v1';
export const LANES = Object.freeze(['L', 'C', 'R']);
export const POWER_LIMIT = 4;
export const FLIPPER_STROKE_MS = 150;
export const TOOLS = Object.freeze({ standard: 0, buffer: 4, capacitor: 14, counterweight: 30 });
export const FINISHES = Object.freeze({ copper: 5, aurora: 12 });

const LENGTH_SCALE = 1.24;

export const PHYSICS = Object.freeze({
  lengthScale: LENGTH_SCALE,
  halfWidth: 3.66,
  radius: .229,
  flipperRadius: .20,
  pivotX: 2.84,
  pivotZ: 3.18 * LENGTH_SCALE,
  flipperLength: 1.84,
  targetRadius: .70,
  targetZ: -3.52 * LENGTH_SCALE,
  gateZ: -2.58 * LENGTH_SCALE,
  top: -4.86 * LENGTH_SCALE,
  drainZ: 4.84 * LENGTH_SCALE,
});

const P = PHYSICS;
const STEP = 1000 / 240;
const DRAIN_MS = 230;
const END_MS = 510;
const OPPOSITE = { L:'R', R:'L' };
const direction = { L:-1, C:0, R:1 };
const PLUNGER_SPEED = [18.5,16.8,20.1,15.6,19.2,17.4];
const PLUNGER_BIAS = [.15,.48,-.30,.78,-.44,.32];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const purchaseKey = id => GAME_ID + ':finish:' + id;

export function cleanSave(value, count) {
  const best = {};
  let unlocked = 1;
  for (let id = 1; id <= count; id++) {
    const stars = value?.best?.[id];
    if (Number.isInteger(stars) && stars >= 1 && stars <= 3) {
      best[id] = stars;
      unlocked = Math.min(count, id + 1);
    }
  }
  const tool = value?.tool;
  return {
    version: 1, best, unlocked,
    tool: Object.hasOwn(TOOLS, tool) && (TOOLS[tool] === 0 || best[TOOLS[tool]]) ? tool : 'standard',
    finish: Object.hasOwn(FINISHES, value?.finish) ? value.finish : 'steel',
  };
}

export function targetPosition(lane, spread) {
  return { x:direction[lane]*2.42*spread, z:P.targetZ };
}

export function newRun(stage, tool, teaching = false) {
  return {
    stage, tool, teaching,
    phase:'ready', elapsed:0, at:0, accumulator:0, index:0, balls:stage.balls, charge:stage.charge,
    side:stage.firstSide, pole:stage.initialPole, beat:stage.firstBeat,
    ball:{x:0,z:0,vx:0,vz:0}, pressed:{L:-Infinity,R:-Infinity}, struck:{L:false,R:false},
    strokeFrom:{L:0,R:0},
    saves:0, lost:0, hits:0, misses:0, shield:false, reserve:false,
    usedBuffer:false, usedCapacitor:false, queued:null, won:false,
  };
}

function enter(state, phase) {
  state.phase = phase;
  state.elapsed = 0;
}

export function ballRest(side) {
  return {x:direction[side]*3.34, z:3.95*P.lengthScale};
}

function launch(state, side, rescue = false) {
  // Each reserve comes off a different spring slot in the launcher.
  const slot = state.lost % PLUNGER_SPEED.length;
  Object.assign(state.ball, ballRest(side), {
    vx:-direction[side]*(rescue ? 1.78 : PLUNGER_BIAS[slot]),
    vz:rescue ? -10.5 : -PLUNGER_SPEED[slot],
  });
  state.side = side;
  state.queued = null;
  enter(state,'shot');
}

const strokeAge = (state, side) => state.at-state.pressed[side];
export const flipping = (state, side) => strokeAge(state,side) < FLIPPER_STROKE_MS;

export function flipperAngle(state, side) {
  const age = strokeAge(state,side);
  const lift = age < 10 ? .93 + .07*age/10 : Math.pow(clamp((FLIPPER_STROKE_MS-age)/140,0,1),1.45);
  return -direction[side]*(-.13 + .76*lift);
}

export function flipperSegment(state, side) {
  return segmentAtAngle(flipperAngle(state,side),side);
}

function segmentAtAngle(angle, side) {
  const ax = direction[side]*P.pivotX;
  const bx = ax - direction[side]*Math.cos(angle)*P.flipperLength;
  return {ax,az:P.pivotZ,bx,bz:P.pivotZ - Math.sin(angle)*-direction[side]*P.flipperLength};
}

function closest(x, z, {ax,az,bx,bz}) {
  const dx = bx-ax;
  const dz = bz-az;
  const fraction = clamp(((x-ax)*dx + (z-az)*dz)/(dx*dx+dz*dz),0,1);
  return {fraction,x:ax+dx*fraction,z:az+dz*fraction};
}

export function returnProgress(state) {
  return clamp((state.ball.z - (P.pivotZ-2.25))/2.75,0,1);
}

export function inReach(state, side) {
  const ball = state.ball;
  if (state.phase !== 'return' || ball.z < P.pivotZ-1.46 || ball.z > P.pivotZ+.48) return false;
  const x = direction[side]*ball.x;
  return x >= .68 && x <= 3.20;
}

export function closedBy(state, lane) {
  if (lane === 'C') return '';
  if (state.stage.shutters && lane === (state.beat ? 'L' : 'R')) return 'shutter';
  if (state.stage.magnetic && lane !== state.pole) return 'polarity';
  return '';
}

function startStroke(state, side) {
  if (state.pressed[side] !== state.at) state.strokeFrom[side] = flipperAngle(state,side);
  state.pressed[side] = state.at;
  state.struck[side] = false;
}

export function paddle(state, side) {
  startStroke(state,side);
  if (state.phase === 'ready') {
    launch(state,side);
    return {type:'serve'};
  }
  if (state.phase !== 'return' || state.side !== side || inReach(state,side)) return null;
  if (state.tool === 'buffer' && !state.usedBuffer && !state.queued && state.ball.z > .7 && state.ball.z < P.pivotZ-1.3) {
    state.queued = side;
    return {type:'buffered'};
  }
  return state.teaching ? {type:'early'} : null;
}

export function togglePole(state) {
  if (!state.stage.magnetic || !['shot','return'].includes(state.phase)) return null;
  if (!state.charge) return {type:'lowPower'};
  state.charge--;
  state.pole = OPPOSITE[state.pole];
  return {type:'switched'};
}

export function armSave(state) {
  if (!state.stage.magnetic || !['shot','return'].includes(state.phase) || state.shield) return null;
  const cost = state.reserve ? 1 : 2;
  if (state.charge < cost) return {type:'lowPower'};
  state.charge -= cost;
  state.reserve = false;
  state.shield = true;
  return {type:'armed'};
}

function railContact(state, lane, blocked, emit) {
  const matched = !blocked && state.stage.order[state.index] === lane;
  const point = {...state.ball};
  if (matched) {
    state.index++;
    state.hits++;
  } else if (blocked) {
    state.misses++;
  }
  if (lane === 'C' && state.stage.magnetic) {
    state.charge = Math.min(POWER_LIMIT,state.charge+2);
    if (state.tool === 'capacitor' && !state.usedCapacitor) {
      state.usedCapacitor = true;
      state.reserve = true;
    }
  }
  state.beat = 1-state.beat;
  if (state.index === state.stage.order.length) {
    state.won = true;
    enter(state,'ending');
    emit({type:'target',lane,point,final:true});
    return;
  }
  const feedback = lane !== 'C' && !blocked && state.stage.feedback;
  if (feedback) {
    state.pole = OPPOSITE[state.pole];
    state.ball.vx -= direction[lane]*3.6;
  }
  emit({type:blocked || (matched ? 'target' : lane === 'C' && state.stage.magnetic ? 'charged' : 'redirected'),lane,point,feedback});
}

function circleContact(ball, x, z, radius, restitution, push = 0) {
  const dx = ball.x-x;
  const dz = ball.z-z;
  const distance = Math.hypot(dx,dz);
  if (distance >= radius || distance < 1e-6) return false;
  const nx = dx/distance;
  const nz = dz/distance;
  ball.x = x+nx*radius;
  ball.z = z+nz*radius;
  const incoming = ball.vx*nx + ball.vz*nz;
  if (incoming >= 0) return false;
  const impulse = -incoming*(1+restitution) + push;
  ball.vx += impulse*nx;
  ball.vz += impulse*nz;
  return true;
}

function guideContact(ball, nx, nz, penetration, restitution) {
  if (penetration <= 0) return;
  ball.x -= nx*penetration;
  ball.z -= nz*penetration;
  const incoming = ball.vx*nx + ball.vz*nz;
  if (incoming > 0) {
    ball.vx -= incoming*(1+restitution)*nx;
    ball.vz -= incoming*(1+restitution)*nz;
  }
}

function collideWalls(ball) {
  const sign = Math.sign(ball.x);
  guideContact(ball,sign,0,Math.abs(ball.x)-(P.halfWidth-P.radius),.82);
  guideContact(ball,0,-1,P.top+P.radius-ball.z,.81);
  // Beveled back corners send bank shots into the rest of the playfield.
  guideContact(ball,sign*.707,-.707,
    (sign*ball.x-ball.z-(P.halfWidth-P.top-.65))*.707+P.radius,.86);
  if (ball.z > P.pivotZ+1.14) {
    // The apron funnels low outside rebounds toward the center drain.
    guideContact(ball,sign*.61,.792,
      Math.abs(ball.x)*.61+(ball.z-P.pivotZ-1.14)*.792-2.03,.46);
  }
}

function flipperContact(ball, segment) {
  const contact = closest(ball.x,ball.z,segment);
  const distance = Math.hypot(ball.x-contact.x,ball.z-contact.z);
  const reach = P.radius+P.flipperRadius;
  if (distance >= reach || distance < 1e-6) return null;
  return {...contact,nx:(ball.x-contact.x)/distance,nz:(ball.z-contact.z)/distance};
}

function playfieldFace(contact, segment, inward) {
  if (!contact) return false;
  const normal = inward*(contact.nx*(segment.bz-segment.az)-contact.nz*(segment.bx-segment.ax));
  // At the rounded end, the contact normal can be mostly sideways.
  return contact.nz < -.22 || (contact.nz <= .05 && normal > 0);
}

function risingContact(ball, side, from, to) {
  const inward = -direction[side];
  const rise = (to-from)*inward;
  if (rise <= 0) return null;
  // Keep each sample's travel well below the ball radius, even at the tip.
  const steps = Math.ceil(rise*P.flipperLength/(P.radius*.7));
  for (let step=0; step<steps; step++) {
    const segment = segmentAtAngle(from+(to-from)*step/steps,side);
    const hit = flipperContact(ball,segment);
    if (playfieldFace(hit,segment,inward)) return hit;
  }
  return null;
}

function collideFlipper(state, side, emit) {
  const ball = state.ball;
  // The ball is clearing the same rubber that just launched it. An immediate
  // re-press moves the bat again without rebounding the departing ball.
  if (state.lastFlipperHit?.side === side && ball.vz < 0 && state.at - state.lastFlipperHit.at < 80) return;
  const inward = -direction[side];
  const angle = flipperAngle(state,side);
  const segment = segmentAtAngle(angle,side);
  const contact = flipperContact(ball,segment);
  const canStrike = flipping(state,side) && !state.struck[side] && ball.vz > 0;
  let powered = canStrike && playfieldFace(contact,segment,inward) ? contact : null;
  if (canStrike && !powered && strokeAge(state,side) <= STEP+1e-6) {
    powered = risingContact(ball,side,state.strokeFrom[side],angle);
  }
  const hit = powered || contact;
  if (!hit) return;
  const {nx,nz,fraction} = hit;
  const reach = P.radius+P.flipperRadius;
  if (powered && powered !== contact) {
    // A ball caught along the swing leaves from the raised face of the rubber.
    const dx = segment.bx-segment.ax;
    const dz = segment.bz-segment.az;
    ball.x = segment.ax+dx*fraction+inward*dz/P.flipperLength*reach;
    ball.z = segment.az+dz*fraction-inward*dx/P.flipperLength*reach;
  } else {
    ball.x = hit.x+nx*reach;
    ball.z = hit.z+nz*reach;
  }
  if (powered) {
    // Heel and tip transfer different amounts of torque. The contact normal,
    // incoming motion and lever arm all contribute to the resulting shot.
    const impulse = 14.8 + 5.4*fraction;
    const horizontal = clamp(inward*(fraction-.64)*1.47 + nx*.24 + ball.vx*.021,-.64,.64);
    ball.vx = horizontal*impulse;
    ball.vz = -Math.sqrt(1-horizontal*horizontal)*impulse - Math.min(ball.vz,9)*.35;
    state.struck[side] = true;
    state.lastFlipperHit = {side,at:state.at};
    state.side = side;
    state.queued = null;
    emit({type:'strike',side, point:{...ball}});
    if (state.teaching) {
      state.teaching = false;
      emit({type:'taught'});
    }
    return;
  }
  const incoming = ball.vx*nx+ball.vz*nz;
  if (incoming < 0) {
    ball.vx -= incoming*1.61*nx;
    ball.vz -= incoming*1.61*nz;
    // Rubber and flipper edges let a weak bounce roll off a resting bat.
    if (nz < 0 && Math.abs(ball.vx) < 1.1) ball.vx += Math.sign(segment.bx-segment.ax)*1.35;
  }
}

function simulate(state, emit) {
  const ball = state.ball;
  const dt = STEP/1000;
  const gravity = 5.05 + state.stage.id*.013;
  ball.vx *= .9995;
  ball.vz = Math.min(8.2 + Math.min(state.stage.id,60)*.085,ball.vz*.9995 + gravity*dt);
  ball.x += ball.vx*dt;
  ball.z += ball.vz*dt;
  collideWalls(ball);

  const mayScore = state.at >= (state.railReadyAt ?? 0);
  for (const lane of LANES) {
    const {x,z} = targetPosition(lane,state.stage.railSpread);
    const obstruction = closedBy(state,lane);
    // Each gate occupies the same cylinder used by its rendered contacts.
    if (lane !== 'C' && obstruction && circleContact(ball,x,P.gateZ-.095,P.radius+.40,.81,1.2)) {
      if (mayScore) {
        state.railReadyAt = state.at+210;
        railContact(state,lane,obstruction,emit);
      }
    }
    if (circleContact(ball,x,z,P.targetRadius+P.radius,.82,2.7) && mayScore) {
      state.railReadyAt = state.at+210;
      railContact(state,lane,obstruction,emit);
      if (state.phase === 'ending') return;
    }
  }

  if (ball.z > 1.0 && ball.z < P.pivotZ+.64) {
    // Visible angled inlane guides keep outside balls just inside the heel.
    const sign = Math.sign(ball.x);
    const guideStart = P.pivotZ-1.73;
    if (ball.vz > 0 && ball.z > guideStart) {
      guideContact(ball,sign*.94,.342,Math.abs(ball.x)*.94+(ball.z-guideStart)*.342-(3.5-P.radius)*.94,.76);
    }
  }
  if (Math.abs(ball.x) > .35) state.side = ball.x < 0 ? 'L' : 'R';
  if (state.queued && ball.vz > 0 && ball.z >= P.pivotZ-1.18) {
    const side = state.queued;
    state.queued = null;
    if (state.side === side) {
      startStroke(state,side);
      state.usedBuffer = true;
    }
  }
  if (ball.z > P.pivotZ-1.72) {
    collideFlipper(state,'L',emit);
    collideFlipper(state,'R',emit);
  }
  state.phase = ball.vz > 0 ? 'return' : 'shot';
  if (ball.z > P.drainZ) {
    enter(state,'drain');
    emit({type:'late'});
  }
}

function finishDrain(state, emit) {
  if (state.teaching || state.shield) {
    const lesson = state.teaching;
    if (state.shield) state.saves++;
    state.shield = false;
    const side = state.tool === 'counterweight' ? OPPOSITE[state.side] : state.side;
    launch(state,side,true);
    emit({type:lesson ? 'lessonRetry' : 'saved'});
    return;
  }
  state.balls--;
  state.lost++;
  enter(state,state.balls > 0 ? 'ready' : 'ending');
  emit({type:'lost'});
}

export function tick(state, milliseconds, emit = () => {}) {
  state.accumulator += milliseconds;
  while (state.accumulator+1e-6 >= STEP) {
    state.accumulator -= STEP;
    state.at += STEP;
    state.elapsed += STEP;
    if (state.phase === 'shot' || state.phase === 'return') simulate(state,emit);
    else if (state.phase === 'drain' && state.elapsed >= DRAIN_MS) finishDrain(state,emit);
    else if (state.phase === 'ending' && state.elapsed >= END_MS) {
      enter(state,'complete');
      emit({type:'complete',won:state.won});
    }
  }
}

// Predict only the first rail a stroke might reach. The preview steps a copy
// through the same contacts as the live ball and never steers the shot.
export function predictedRail(state) {
  const side = state.side;
  if (!inReach(state,side)) return null;
  const sample = {
    ...state,
    ball:{...state.ball},
    pressed:{...state.pressed},
    struck:{...state.struck},
    strokeFrom:{...state.strokeFrom},
  };
  paddle(sample,side);
  let struck = false;
  let lane = null;
  const observe = event => {
    if (event.type === 'strike') struck = true;
    if (struck && event.lane) lane = event.lane;
  };
  for (let elapsed=0; elapsed<1100 && !lane; elapsed+=STEP) {
    tick(sample,STEP,observe);
    if ((!struck && elapsed>FLIPPER_STROKE_MS) || sample.phase === 'drain') break;
  }
  return lane;
}

export function stars(state) {
  if (!state.won) return 0;
  return 1 + Number(state.lost <= 1) + Number(state.lost === 0 && state.misses <= 1);
}
