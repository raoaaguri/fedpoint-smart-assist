import { useSyncExternalStore } from 'react';
import { isMuted, setMuted, subscribeMuted } from '../utils/sound';

/** [muted, setMuted] kept in sync with the sound module. */
export function useSoundMuted() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted);
  return [muted, setMuted];
}
