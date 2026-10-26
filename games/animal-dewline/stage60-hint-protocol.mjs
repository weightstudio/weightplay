// PROTOTYPE_NOT_IN_GAME. The worker sends codes; presentation localizes them.
import {STAGES, hint} from './stage60-model.mjs?v=20261027-dewline-v19-finale60-1';

function validState(stage, state) {
  if (!state || typeof state !== 'object' || !Array.isArray(state.values) || state.values.length !== 3 ||
      !state.values.every(value => Number.isInteger(value) && value >= 0 && value <= 6) ||
      ![2,3].includes(state.route) || (stage.network !== 'T' && state.route !== stage.initialRoute) ||
      !(state.clip === null || stage.allowedClips.includes(state.clip)) ||
      !Number.isInteger(state.sensor) || state.sensor < 0 || state.sensor > stage.sensors.length ||
      (stage.routeGateSensor && state.route === 3 && state.sensor === 0) ||
      !Array.isArray(state.captures) || state.captures.length !== 3 ||
      !state.captures.every(value => value === null || (Number.isInteger(value) && value >= 0 && value <= 12)) ||
      !Array.isArray(state.capturedOrder) || state.capturedOrder.length > stage.captureSlots ||
      new Set(state.capturedOrder).size !== state.capturedOrder.length ||
      !state.capturedOrder.every(bed => stage.captureBeds.includes(bed) && state.captures[bed - 1] !== null) ||
      state.captures.some((value,index) => value !== null && !state.capturedOrder.includes(index + 1)) ||
      (stage.captureOrder && state.capturedOrder.some((bed,index) => bed !== stage.captureOrder[index])) ||
      (stage.captureSensorGate && state.capturedOrder.length > (stage.captureSensorAfterFirst ? 1 : 0) && state.sensor < stage.sensors.length) ||
      typeof state.lockedAfterCapture !== 'boolean' ||
      state.lockedAfterCapture !== (stage.lockAfterCapture !== null && state.capturedOrder.length > 0)) return false;
  if (stage.moveClipAfterCapture && state.capturedOrder.length > 0) return stage.allowedClips.includes(state.captureClip);
  return state.captureClip === null;
}

export function handleHintRequest(message) {
  const id = message?.id ?? null;
  try {
    if (message?.type !== 'solve' || !Number.isSafeInteger(id) || id < 1 ||
        !Number.isInteger(message.stageNumber)) return {type:'result', id, status:'error', code:'invalid_request'};
    const stage = STAGES.find(item => item.number === message.stageNumber);
    if (!stage || !validState(stage, message.state)) return {type:'result', id, status:'error', code:'invalid_request'};
    return {type:'result', id, ...hint(stage, message.state)};
  } catch (_) {
    return {type:'result', id, status:'error', code:'worker_failed'};
  }
}
