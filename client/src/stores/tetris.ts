import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import { getRandomElementId } from "@/utills/common.utills";
import { generateAnyFieldMatrix, renderFieldMatrix, getMiddlePosition } from "@/utills/tetris.store.utills";
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
  const frames = ref(-1);
  const fieldMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['filled']));
  const staticMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']));
  const prevElementId = ref(-1);
  const elementId = ref(getRandomElementId(allElements.length, prevElementId.value));
  const elementSpin = ref(0);
  const prevElementCoords = ref([getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), -1]);
  const elementCoords = ref([getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0]);
  const fallingSpeed = ref(conf.fallingSpeed);

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
  const getFallingSpeed = computed(() => fallingSpeed.value);

  // ACTIONS:
  function setWidth(newWidth: number) {
    generateAnyFieldMatrix(newWidth, height.value, generateFieldTypes['filled']);
    width.value = newWidth;
    elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
  }
  function setHeight(newHeight: number) {
    generateAnyFieldMatrix(width.value, newHeight, generateFieldTypes['filled']);
    height.value = newHeight;
  }
  function setAppState(newState: appStateEnum) {

    // Delete it: just for test
    // const testMatrix = [
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // ]
    // renderFieldMatrix(staticMatrix.value, testMatrix, 0, [0,-1], [0,0], 0);
    // Delete it: just for test

    if (appStateEnum[newState] == 'init') {
      createAnyFieldMatrix(generateFieldTypes['filled']);
      resetFrames();
    } else if (appStateEnum[newState] == 'runned') {
      setGameState(gameStateEnum.birth);
    } else if (appStateEnum[newState] == 'finished') {
      createAnyFieldMatrix(generateFieldTypes['empty']);
      setGameState(gameStateEnum.nothing);
      updateFrames();
    } else {
      setGameState(gameStateEnum.nothing);
    }
    appState.value = newState;
  }
  function setGameState(newState: gameStateEnum) {
    if (gameStateEnum[newState] == 'birth') {
      createAnyFieldMatrix(generateFieldTypes['empty']);
      prevElementId.value = elementId.value;
      elementId.value = getRandomElementId(allElements.length, prevElementId.value);
      elementSpin.value = 0;
      prevElementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), -1];
      elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
      updateFrames();
      setGameState(gameStateEnum.movement);
    } else {
      gameState.value = newState;
    }
  }
  function updateGameScore(addPoints: number) {
    score.value += addPoints;
  }
  function resetGameScore() { 
    score.value = 0 
  }
  function updateFrames() {
    frames.value += 1;
    getStatsInConsole();
  }
  function resetFrames() {
    frames.value = -1;
  }
  function createAnyFieldMatrix(generateFieldType: generateFieldTypes) {
    fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldType);
  }
  function renderNewFrame(relativeCoords: number[]) {
    const result = renderFieldMatrix(staticMatrix.value, fieldMatrix.value, elementId.value, prevElementCoords.value, elementCoords.value, elementSpin.value);
    elementCoordsUpdate(relativeCoords);
    fieldMatrix.value = [...result.matrix];
    setGameState(result.gameState);
    updateFrames();
  }
  function elementCoordsUpdate(relativeCoords: number[]) {
    prevElementCoords.value = elementCoords.value;
    elementCoords.value[0] += relativeCoords[0];
    elementCoords.value[1] += relativeCoords[1];
  }
  function getStatsInConsole() {
    console.log("**************** FRAME # [" + frames.value + "] ***************");
    // console.log("width: " + width.value);
    // console.log("height: " + height.value);
    console.log("appState: " + appStateEnum[appState.value]);
    console.log("gameState: " + gameStateEnum[gameState.value]);
    // console.log("score: " + score.value);
    // console.log("fieldMatrix: " + fieldMatrix.value);
    // console.log("staticMatrix: " + staticMatrix.value);
    // console.log("prevElementId: " + prevElementId.value);
    console.log("elementId: " + elementId.value);
    // console.log("elementSpin: " + elementSpin.value);
    // console.log("prevElementCoords: " + prevElementCoords.value);
    console.log("elementCoords: " + elementCoords.value);
    // console.log("fallingSpeed: " + fallingSpeed.value);
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
    getFallingSpeed,
    setWidth,
    setHeight,
    setAppState,
    setGameState,
    updateGameScore,
    resetGameScore,
    updateFrames,
    resetFrames,
    createAnyFieldMatrix,
    renderNewFrame,
    getStatsInConsole
  }
});
