import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import { generateAnyFieldMatrix } from "@/utills/tetris.store.utills";
import { generateFieldTypes } from "@/config/tetris.enums";
import conf from '@/config/tetris.config.ts';


export const useTetrisStore = defineStore('tetris', () => {

  // STATE:
  const width = ref(conf.width.min);
  const height = ref(conf.height.min);
  const appState = ref(appStateEnum.init);
  const gameState = ref(gameStateEnum.nothing);
  const score = ref(0);
  const frames = ref(0);
  const fieldMatrix = ref(new Array());

  // GETTERS:
  const getWidth = computed(() => width.value);
  const getHeight = computed(() => height.value);
  const getAppStateRef = () => appState;
  const getAppState = computed(() => appState.value);
  const getGameStateRef = () => gameState;
  const getGameState = computed(() => gameState.value);
  const getScore = computed(() => score.value);
  const getFramesRef = () => frames;
  const getFrames = computed(() => frames.value);
  const getFieldMatrixRef = () => fieldMatrix;

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
      setGameState(gameStateEnum.birth);
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
  function updateFrames() {
    frames.value += 1;
  }
  function resetFrames() {
    frames.value = 0;
  }
  function createFieldMatrix() {
    fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
  }
  function createRandomFieldMatrix() {
    fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['random']);
  }

  return { 
    getWidth, 
    getHeight,
    getAppStateRef,
    getAppState,
    getGameStateRef,
    getGameState,
    getScore,
    getFramesRef,
    getFrames,
    getFieldMatrixRef,
    setWidth,
    setHeight,
    setAppState,
    setGameState,
    updateGameScore,
    resetGameScore,
    updateFrames,
    resetFrames,
    createFieldMatrix,
    createRandomFieldMatrix
  }
});
