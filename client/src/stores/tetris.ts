import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import conf from '@/config/tetris.config.ts';

export const useTetrisStore = defineStore('tetris', () => {

  // STATE:
  const width = ref(conf.width.min);
  const height = ref(conf.height.min);
  const appState = ref(appStateEnum.init);
  const gameState = ref(gameStateEnum.nothing);
  const score = ref(0);
  const steps = ref(0);

  // GETTERS:
  const getWidth = computed(() => width.value);
  const getHeight = computed(() => height.value);
  const getAppStateRef = () => appState;
  const getAppState = computed(() => appState.value);
  const getGameStateRef = () => gameState;
  const getGameState = computed(() => gameState.value);
  const getScore = computed(() => score.value);
  const getStepsRef = () => steps;
  const getSteps = computed(() => steps.value);

  // ACTIONS:
  function setWidth(newValue: number) {
    width.value = newValue;
  }
  function setHeight(newValue: number) {
    height.value = newValue;
  }
  function setAppState(newState: appStateEnum) {
    appState.value = newState;
    if (appStateEnum[newState] == 'runned') {
      setGameState(gameStateEnum.movement);
    } else {
      setGameState(gameStateEnum.nothing);
    }
  }
  function setGameState(newState: gameStateEnum) {
    gameState.value = newState;
  }
  function updateGameScore(addPoints: number) {
    score.value += addPoints;
  }
  function resetGameScore() { 
    score.value = 0 
  }
  function updateSteps() {
    steps.value += 1;
  }
  function resetSteps() {
    steps.value = 0;
  }

  return { 
    getWidth, 
    getHeight,
    getAppStateRef,
    getAppState,
    getGameStateRef,
    getGameState,
    getScore,
    getStepsRef,
    getSteps,
    setWidth,
    setHeight,
    setAppState,
    setGameState,
    updateGameScore,
    resetGameScore,
    updateSteps,
    resetSteps
  }
});
