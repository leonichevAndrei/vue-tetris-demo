import { defineStore } from "pinia"
import { computed, ref, type Ref } from "vue"
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
  const movementSpeed = ref(conf.movementSpeed);
  const sideSpeed = ref(conf.sideSpeed);
  const intervalIdFalling: Ref<number|null> = ref(null);
  const keyPressed: Ref<{ [key: string]: boolean }> = ref({ ArrowUp: false, ArrowLeft: false, ArrowRight: false, ArrowDown: false, Space: false });
  const keyInterval: Ref<{ [key: string]: number | null }> = ref({ ArrowUp: null, ArrowLeft: null, ArrowRight: null, ArrowDown: null, Space: null });

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
  const getElementCoords = computed(() => elementCoords.value);
  const getFallingSpeed = computed(() => fallingSpeed.value);
  const getMovementSpeed = computed(() => movementSpeed.value);
  const getSideSpeed = computed(() => sideSpeed.value);
  const getKeyPressed = computed(() => keyPressed.value);
  const getKeyInterval = computed(() => keyInterval.value);

  // ACTIONS:
  function startFalling(speed: number) {
    console.log("startFalling()");
    if (appStateEnum[appState.value] == 'runned') {
      intervalIdFalling.value = setInterval(() => {
        if (appStateEnum[appState.value] == 'runned') {
          renderNewFrame([0,1]);
          getStatsInConsole("startFalling() and intervalIdFalling is active...");
        }
      }, speed);
    }
  }
  function stopFalling() {
    console.log("stopFalling()")
    if (intervalIdFalling.value !== null) clearInterval(intervalIdFalling.value!);
    intervalIdFalling.value = null;
  }
  function setWidth(newWidth: number) {
    width.value = newWidth;
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    console.log('setWidth from ' + width.value + " to " + newWidth);
    elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
  }
  function setHeight(newHeight: number) {
    height.value = newHeight;
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    console.log('setHeight from ' + height.value + " to " + newHeight);
  }
  function setAppState(newState: appStateEnum) {
    console.log("set App state to: " + appStateEnum[newState]);
    if (appStateEnum[newState] == 'init') {
      console.log("setAppState -> init");
      appState.value = newState;
      fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.filled);
      resetFrames();
    } else if (appStateEnum[newState] == 'runned') {
      console.log("setAppState -> runned");
      appState.value = newState;
      setGameState(gameStateEnum.birth);
    } else if (appStateEnum[newState] == 'finished') {
      console.log("setAppState -> finished");
      //fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.empty);
      //staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.empty);
      appState.value = newState;
      setGameState(gameStateEnum.nothing);
      //updateFrames();
    }
  }
  function setGameState(newState: gameStateEnum) {
    console.log("set Game state to: " + gameStateEnum[newState]);
    if (gameStateEnum[newState] == 'birth') {
      console.log("setGameState -> birth");
      prevElementId.value = elementId.value;
      elementId.value = getRandomElementId(allElements.length, prevElementId.value);
      elementSpin.value = 0;
      prevElementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), -1];
      elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
      renderNewFrame([0,0]);
      if (gameState.value != gameStateEnum.movement) {
        console.log('setGameState -> birth -> setGameState to movement');
        setGameState(gameStateEnum.movement);
      };
      return;
    } else if (gameStateEnum[newState] == 'movement') {
      console.log("setGameState -> movement");
      gameState.value = newState;
      startFalling(fallingSpeed.value);
    } else if (gameStateEnum[newState] == 'collision') {
      console.log("setGameState -> collision");
      setGameState(gameStateEnum.birth); 
      return;
    } else if (gameStateEnum[newState] == 'cleaning') {
      console.log("setGameState -> cleaning");
      gameState.value = newState;
    } else if (gameStateEnum[newState] == 'nothing') {
      console.log("setGameState -> nothing");
      gameState.value = newState;
      stopFalling();
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
    // getStatsInConsole();
  }
  function resetFrames() {
    frames.value = -1;
  }
  function backToPrevSpin() {
    const nextSpin = elementSpin.value - 1;
    elementSpin.value = allElements[elementId.value][nextSpin] != undefined ? nextSpin : allElements[elementId.value].length - 1;
  }
  function updateSpin() {
    const nextSpin = elementSpin.value + 1;
    elementSpin.value = allElements[elementId.value][nextSpin] != undefined ? nextSpin : 0;
  }
  function renderNewFrame(relativeCoords: number[]) {
    console.log("renderNewFrame()");
    const prevElementCoordsBackup = JSON.parse(JSON.stringify(prevElementCoords.value));
    const elementCoordsBackup = JSON.parse(JSON.stringify(elementCoords.value));
    elementCoordsUpdate(relativeCoords);
    const result = renderFieldMatrix(staticMatrix.value, fieldMatrix.value, elementId.value, prevElementCoords.value, elementCoords.value, elementSpin.value);
    fieldMatrix.value = JSON.parse(JSON.stringify(result.matrix));
    updateFrames();
    if (result.returnPrevCoords) {
      prevElementCoords.value = prevElementCoordsBackup;
      elementCoords.value = elementCoordsBackup;
    }
    if (result.isGameOver !== undefined && result.isGameOver) {
       console.log("renderNewFrame() -> isGameOver !!! app state set to finished");
       stopFalling();
       setAppState(appStateEnum.finished);
    } else {
      if (result.gameState == gameStateEnum.collision) {
        staticMatrix.value = JSON.parse(JSON.stringify(result.matrix));
      }
      if (result.gameState != gameState.value) {
        console.log("renderNewFrame -> setGameState to " + gameStateEnum[result.gameState]);
        setGameState(result.gameState);
      };
      if (result.returnPrevSpin) {
        backToPrevSpin();
      }
    }
  }
  function elementCoordsUpdate(relativeCoords: number[]) {
    prevElementCoords.value = JSON.parse(JSON.stringify(elementCoords.value));
    elementCoords.value[0] += relativeCoords[0];
    elementCoords.value[1] += relativeCoords[1];
  }
  function getStatsInConsole(place: string) {
    console.log("*************** FRAME # [" + frames.value + "] IN <" + place + "> **************");
    // console.log("width: " + width.value);
    // console.log("height: " + height.value);
    console.log("appState: " + appStateEnum[appState.value]);
    console.log("gameState: " + gameStateEnum[gameState.value]);
    // console.log("score: " + score.value);
    // console.log("fieldMatrixSize: " + fieldMatrix.value[0].length + "/" + fieldMatrix.value.length);
    // console.log("staticMatrixSize: " + staticMatrix.value[0].length + "/" + staticMatrix.value.length);
    // console.log("prevElementId: " + prevElementId.value);
    console.log("elementId: " + elementId.value);
    console.log("elementSpin: " + elementSpin.value);
    // console.log("prevElementCoords: " + prevElementCoords.value);
    console.log("elementCoords: " + elementCoords.value);
    // console.log("fallingSpeed: " + fallingSpeed.value);
    console.log("intervalIdFalling: " + intervalIdFalling.value);
    console.log(`keyPressed: { ArrowUp: ${keyPressed.value.ArrowUp}, ArrowLeft: ${keyPressed.value.ArrowLeft}, ArrowRight: ${keyPressed.value.ArrowRight}, ArrowDown: ${keyPressed.value.ArrowDown}, Space: ${keyPressed.value.Space} }`);
    console.log(`keyInterval: { ArrowUp: ${keyInterval.value.ArrowUp}, ArrowLeft: ${keyInterval.value.ArrowLeft}, ArrowRight: ${keyInterval.value.ArrowRight}, ArrowDown: ${keyInterval.value.ArrowDown}, Space: ${keyInterval.value.Space} }`);
    console.log("****************************************");
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
    getElementCoords,
    getFallingSpeed,
    getMovementSpeed,
    getSideSpeed,
    getKeyPressed,
    getKeyInterval,
    startFalling,
    stopFalling,
    setWidth,
    setHeight,
    setAppState,
    setGameState,
    updateGameScore,
    resetGameScore,
    updateFrames,
    resetFrames,
    backToPrevSpin,
    updateSpin,
    renderNewFrame,
    getStatsInConsole
  }
});
