import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import { useTetrisStore } from '@/stores/tetris';

function getAppAndGameStateLog(appState: appStateEnum, gameState: gameStateEnum) {
  return `<App: [${appStateEnum[appState]}] & Game: [${gameStateEnum[gameState]}]> ->`;
}
function addFrames(frames: number) {
  return `Frame<${frames}>`;
}
export function customLogger(logInfo: string) {
  const tetrisStore = useTetrisStore();
  if (tetrisStore.isEnableLogger) {
    console.log(`
      ${addFrames(tetrisStore.getFrames)} 
      ${getAppAndGameStateLog(tetrisStore.getAppState, tetrisStore.getGameState)} 
      ${logInfo}
    `);
  }
}