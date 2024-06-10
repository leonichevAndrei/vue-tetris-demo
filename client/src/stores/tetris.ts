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
  
  // ADDITIONAL HELPERS (FOR DEVELOPMENT ONLY):
  const startTimestamp = performance.now();
  function getMSLog() {
    let difference = (performance.now() - startTimestamp).toString();
    if (difference.length == 5) {
      difference += ".000000000000";
    }
    return `${difference}: `;
  }
  function getAppAndGameStateLog() {
    return `<App:${appStateEnum[appState.value]}/Game:${gameStateEnum[gameState.value]}> ->`;
  }
  function addFrames() {
    return `Frame<${frames.value}>`;
  }
  function myLog(logInfo: string) {
    console.log(`
      ${addFrames()} 
      ${getAppAndGameStateLog()} 
      ${logInfo}`);
  }

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
    myLog("startFalling()");
    if (appStateEnum[appState.value] == 'runned') {
      intervalIdFalling.value = setInterval(() => {
        if (appStateEnum[appState.value] == 'runned') {
          myLog("startFalling() -> intervalIdFalling is active...");
          renderNewFrame([0,1]);
        }
      }, speed);
    }
  }
  function stopFalling() {
    myLog("stopFalling()")
    if (intervalIdFalling.value !== null) clearInterval(intervalIdFalling.value!);
    intervalIdFalling.value = null;
  }
  function setWidth(newWidth: number) {
    width.value = newWidth;
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    myLog('setWidth from ' + width.value + " to " + newWidth);
    elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
  }
  function setHeight(newHeight: number) {
    height.value = newHeight;
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    myLog('setHeight from ' + height.value + " to " + newHeight);
  }
  function setAppState(newState: appStateEnum) {
    myLog("set App state to: " + appStateEnum[newState]);
    if (appStateEnum[newState] == 'init') {
      myLog("setAppState -> init");
      appState.value = newState;
      fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.filled);
      staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.empty);
      resetFrames();
      resetGameScore();
    } else if (appStateEnum[newState] == 'runned') {
      myLog("setAppState -> runned");
      appState.value = newState;
      setGameState(gameStateEnum.birth);
    } else if (appStateEnum[newState] == 'finished') {
      myLog("setAppState -> finished");
      appState.value = newState;
      setGameState(gameStateEnum.nothing);
      console.log("before");
      setTimeout(() => {
      }, 2000);
      console.log("after");
    }
  }
  function setGameState(newState: gameStateEnum) {
    myLog("set Game state to: " + gameStateEnum[newState]);
    if (gameStateEnum[newState] == 'birth') {
      myLog("setGameState -> birth");
      prevElementId.value = elementId.value;
      elementId.value = getRandomElementId(allElements.length, prevElementId.value);
      elementSpin.value = 0;
      prevElementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), -1];
      elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
      renderNewFrame([0,0]);
      if (gameState.value != gameStateEnum.nothing && gameState.value != gameStateEnum.movement) {
        myLog('setGameState -> birth -> setGameState to movement');
        setGameState(gameStateEnum.movement);
      };
    } else if (gameStateEnum[newState] == 'movement') {
      myLog("setGameState -> movement");
      gameState.value = newState;
      startFalling(fallingSpeed.value);
    } else if (gameStateEnum[newState] == 'collision') {
      myLog("setGameState -> collision");
      setGameState(gameStateEnum.birth); 
      return;
    } else if (gameStateEnum[newState] == 'cleaning') {
      myLog("setGameState -> cleaning");
      gameState.value = newState;
    } else if (gameStateEnum[newState] == 'nothing') {
      myLog("setGameState -> nothing");
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
    myLog("updateFrames()");
    frames.value += 1;
  }
  function resetFrames() {
    myLog("resetFrames()");
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
    myLog("renderNewFrame()");
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
       myLog("renderNewFrame() -> isGameOver !!! app state set to finished");
       setAppState(appStateEnum.finished);
    } else {
      if (result.gameState == gameStateEnum.collision) {
        staticMatrix.value = JSON.parse(JSON.stringify(result.matrix));
      }
      if (result.gameState != gameState.value) {
        myLog("renderNewFrame -> setGameState to " + gameStateEnum[result.gameState]);
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
    myLog("*************** FRAME # [" + frames.value + "] IN <" + place + "> **************");
    // myLog("width: " + width.value);
    // myLog("height: " + height.value);
    myLog("appState: " + appStateEnum[appState.value]);
    myLog("gameState: " + gameStateEnum[gameState.value]);
    // myLog("score: " + score.value);
    // myLog("fieldMatrixSize: " + fieldMatrix.value[0].length + "/" + fieldMatrix.value.length);
    // myLog("staticMatrixSize: " + staticMatrix.value[0].length + "/" + staticMatrix.value.length);
    // myLog("prevElementId: " + prevElementId.value);
    myLog("elementId: " + elementId.value);
    myLog("elementSpin: " + elementSpin.value);
    // myLog("prevElementCoords: " + prevElementCoords.value);
    myLog("elementCoords: " + elementCoords.value);
    // myLog("fallingSpeed: " + fallingSpeed.value);
    myLog("intervalIdFalling: " + intervalIdFalling.value);
    myLog(`keyPressed: { ArrowUp: ${keyPressed.value.ArrowUp}, ArrowLeft: ${keyPressed.value.ArrowLeft}, ArrowRight: ${keyPressed.value.ArrowRight}, ArrowDown: ${keyPressed.value.ArrowDown}, Space: ${keyPressed.value.Space} }`);
    myLog(`keyInterval: { ArrowUp: ${keyInterval.value.ArrowUp}, ArrowLeft: ${keyInterval.value.ArrowLeft}, ArrowRight: ${keyInterval.value.ArrowRight}, ArrowDown: ${keyInterval.value.ArrowDown}, Space: ${keyInterval.value.Space} }`);
    myLog("****************************************");
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
