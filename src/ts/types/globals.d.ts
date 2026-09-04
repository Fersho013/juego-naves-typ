// Global window properties
declare global {
  interface Window {
    __getGameState: () => string;
    __getGameMode: () => string;
    toggleVolume: () => void;
    changeNaveColor: (color: string) => void;
    showScreen: (screenId: string) => void;
    toggleTouchUI: () => void;
    togglePause: () => void;
    toggleDeviceMode: () => void;
    applyOptions: () => void;
    startMission: (mode: string) => void;
    startCustom: () => void;
    acceptContinue: () => void;
    exitToMenu: () => void;
    openLayoutEditor: () => void;
    closeLayoutEditor: (save: boolean) => void;
  }
}
export {};
