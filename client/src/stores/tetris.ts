import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import { getRandomElementId, getMiddlePosition } from "@/utills/common.utills";
import { generateAnyFieldMatrix } from "@/utills/tetris.store.utills";
import { generateFieldTypes } from "@/config/tetris.enums";
import allElements from '@/assets/elements/all-elms';
import conf from '@/config/tetris.config.ts';

export const useTetrisStore = defineStore('tetris', () => {

  // STATE:
  const width = ref(conf.width.min);
  const height = ref(conf.height.min);
  const appState = ref(appStateEnum.init);
  const gameState = ref(gameStateEnum.nothing);
  const score = ref(0);
  const frames = ref(0);
  const fieldMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['filled']));
  const elementMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']));
  const prevElementId = ref(0);
  const elementId = ref(getRandomElementId(allElements.length, prevElementId.value));
  const elementCoords = ref([getMiddlePosition(width.value),0]);
  const elementSpin = ref(0);
  const staticMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']));

  // GETTERS:
  const getWidth = computed(() => width.value);
  const getWidthRef = () => width;
  const getHeight = computed(() => height.value);
  const getHeightRef = () => height;
  const getAppState = computed(() => appState.value);
  const getAppStateRef = () => appState;
  const getGameState = computed(() => gameState.value);
  const getGameStateRef = () => gameState;
  const getScore = computed(() => score.value);
  const getFrames = computed(() => frames.value);
  const getFramesRef = () => frames;
  const getFieldMatrixRef = () => fieldMatrix;

  // ACTIONS:
  function setWidth(newWidth: number) {
    generateAnyFieldMatrix(newWidth, height.value, generateFieldTypes['filled']);
    width.value = newWidth;
  }
  function setHeight(newHeight: number) {
    generateAnyFieldMatrix(width.value, newHeight, generateFieldTypes['filled']);
    height.value = newHeight;
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
  function createAnyFieldMatrix(generateFieldType: generateFieldTypes) {
    fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldType);
  }

  return { 
    getWidth, 
    getWidthRef, 
    getHeight,
    getHeightRef,
    getAppState,
    getAppStateRef,
    getGameState,
    getGameStateRef,
    getScore,
    getFrames,
    getFramesRef,
    getFieldMatrixRef,
    setWidth,
    setHeight,
    setAppState,
    setGameState,
    updateGameScore,
    resetGameScore,
    updateFrames,
    resetFrames,
    createAnyFieldMatrix
  }
});
