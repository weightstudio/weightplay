const HANDOFF_KEY = 'blockmart.departing-owner';

export function takeNavigationHandoff(storage) {
  try {
    const predecessor = storage.getItem(HANDOFF_KEY);
    storage.removeItem(HANDOFF_KEY);
    return predecessor;
  } catch { return null; }
}

export function leaveNavigationHandoff(storage, documentId) {
  try { storage.setItem(HANDOFF_KEY, documentId); } catch {}
}

export function canClaimOwner(owner, {documentId, tabToken, reload, predecessor, takeover}) {
  return takeover || !owner || owner.documentId === documentId
    || (owner.tabToken === tabToken && (reload || (Boolean(predecessor) && owner.documentId === predecessor)));
}
