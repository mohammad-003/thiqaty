import { create } from 'zustand';
import { AppState, AppStateStatus } from 'react-native';

interface AuthState {
  isSetup: boolean; // True if the user has completed the first-run PIN setup
  isUnlocked: boolean; // True if the current session is unlocked
  autoLockMinutes: number; // Configurable idle time before lock

  // Actions
  setSetup: (isSetup: boolean) => void;
  setUnlocked: (unlocked: boolean) => void;
  setAutoLockMinutes: (minutes: number) => void;
  lockApp: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSetup: false,
  isUnlocked: false,
  autoLockMinutes: 2, // Default to 2 minutes

  setSetup: (isSetup) => set({ isSetup }),
  setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
  setAutoLockMinutes: (minutes) => set({ autoLockMinutes: minutes }),
  lockApp: () => set({ isUnlocked: false }),
}));

// Setup the AppState listener to handle auto-lock
let lastBackgroundTime: number | null = null;

AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
  const store = useAuthStore.getState();

  if (!store.isSetup) return; // Don't lock during setup

  if (nextAppState === 'background' || nextAppState === 'inactive') {
    if (lastBackgroundTime === null) {
      lastBackgroundTime = Date.now();
    }
  } else if (nextAppState === 'active') {
    if (lastBackgroundTime !== null) {
      const idleTimeMs = Date.now() - lastBackgroundTime;
      const autoLockMs = store.autoLockMinutes * 60 * 1000;

      if (idleTimeMs >= autoLockMs) {
        store.lockApp();
      }
      lastBackgroundTime = null;
    }
  }
});
