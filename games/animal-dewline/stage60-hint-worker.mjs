// A synchronous BFS is contained entirely inside this short-lived module worker.
import {handleHintRequest} from './stage60-hint-protocol.mjs?v=20261027-dewline-v19-finale60-1';
globalThis.addEventListener('message', event => {
  globalThis.postMessage(handleHintRequest(event.data));
});
