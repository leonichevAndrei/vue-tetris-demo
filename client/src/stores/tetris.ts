import { defineStore } from "pinia"
import { computed, ref, type Ref } from "vue"
import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import { generateAnyFieldMatrix, renderFieldMatrix, getMiddlePosition, getPresetMatrix, getCleaningStateByStaticMatrix, renderCleanedFieldMatrix, combineStaticMatrixPartsInOne, calculateSizePixels } from "@/utills/tetris.store.utills";
import { generateFieldTypes } from "@/config/tetris.enums";
import { calculateFallingSpeed, calculateScorePoints, getRandomElementId } from "@/utills/common.utills";
import allElements from '@/assets/elements/all-elms';
import conf from '@/config/tetris.config.ts';
import { customLogger } from "@/utills/logging.utills";

export const useTetrisStore = defineStore('tetris', () => {

  // STATE:
  const width = ref(conf.defaultWidth);
  const height = ref(conf.defaultHeight);
  const widthPixels = ref(calculateSizePixels(width.value));
  const heightPixels = ref(calculateSizePixels(height.value));
  const appState = ref(appStateEnum.init);
  const gameState = ref(gameStateEnum.nothing);
  const score = ref(0);
  const frames = ref(-1);
  const fieldMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['filled']));
  const staticMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']));
  const elementId = ref(-1);
  const nextElementId = ref(getRandomElementId(allElements.length, elementId.value));
  const elementSpin = ref(0);
  const prevElementCoords = ref([0,1]);
  const elementCoords = ref([0,0]); 
  const speedLevel = ref(conf.defaultSpeedLevel);
  const fallingSpeed = ref(calculateFallingSpeed(speedLevel.value, conf.speedIncreaseFactor));
  const movementSpeed: Ref<number> = ref(balanceMovementSpeed(conf.movementSpeed));
  const sideSpeed = ref(conf.sideSpeed);
  const intervalIdFalling: Ref<number|undefined> = ref(undefined);
  const intervalIdCleaning: Ref<number|undefined> = ref(undefined);
  const keyPressed: Ref<{ [key:string]:boolean }> = ref({ ArrowUp: false, ArrowLeft: false, ArrowRight: false, ArrowDown: false, Space: false });
  const keyInterval: Ref<{ [key:string]:number|undefined }> = ref({ ArrowUp: undefined, ArrowLeft: undefined, ArrowRight: undefined, ArrowDown: undefined, Space: undefined });
  const cleaningState: Ref<{ byXAxis:number[];byYAxis:number[] }> = ref({ byXAxis:[], byYAxis:[] });
  const linesErasedCounter = ref(0);
  const enableLogger = ref(false);

  // GETTERS:
  const getWidth = computed(() => width.value);
  const getWidthRef = () => width;
  const getHeight = computed(() => height.value);
  const getHeightRef = () => height;
  const getWidthPixelsRef = () => widthPixels;
  const getHeightPixelsRef = () => heightPixels;
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
  const getNextElementId = computed(() => nextElementId.value);
  const getSpeedLevel = computed(() => speedLevel.value);
  const getLinesErasedCounter = computed(() => linesErasedCounter.value);
  const isEnableLogger = computed(() => enableLogger.value);

  // ACTIONS:
  function goToNextAppState() {
    let nextAppState = getAppState.value + 1;
    if (appStateEnum[nextAppState] === undefined) {
      nextAppState = 0;
    }
    setAppState(nextAppState);
  }
  function startFalling(speed: number) {
    customLogger("startFalling()");
    stopFalling();
    if (appStateEnum[appState.value] == 'runned') {
      intervalIdFalling.value = setInterval(() => {
        if (appStateEnum[appState.value] == 'runned') {
          customLogger("startFalling() -> intervalIdFalling is active...");
          renderNewFrame([0,1]);
        }
      }, speed);
    }
  }
  function stopFalling() {
    customLogger("stopFalling()")
    if (intervalIdFalling.value !== undefined) {
      clearInterval(intervalIdFalling.value!);
      intervalIdFalling.value = undefined;
    }
  }
  function startCleaning(speed:number) {
    customLogger("startCleaning()");
    stopCleaning();
    if (appStateEnum[appState.value] == 'runned') {
      intervalIdCleaning.value = setInterval(() => {
        if (appStateEnum[appState.value] == 'runned' && intervalIdFalling.value === undefined) {
          customLogger("startCleaning() -> intervalIdCleaning is active...");
          renderNewCleaningFrame();
        }
      }, speed);
    }
  }
  function stopCleaning() {
    customLogger("stopCleaning()");
    if (intervalIdCleaning.value !== undefined) {
      clearInterval(intervalIdCleaning.value!);
      intervalIdCleaning.value = undefined;
    }
  }
  function setWidth(newWidth: number) {
    customLogger("setWidth()");
    width.value = newWidth;
    widthPixels.value = calculateSizePixels(newWidth);
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    customLogger('setWidth from ' + width.value + " to " + newWidth);
  }
  function setHeight(newHeight: number) {
    customLogger("setHeight()");
    height.value = newHeight;
    heightPixels.value = calculateSizePixels(newHeight);
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    customLogger('setHeight from ' + height.value + " to " + newHeight);
  }
  function setAppState(newState: appStateEnum) {
    customLogger("PREPARE TO set App state to: " + appStateEnum[newState] + "...");
    if (appStateEnum[newState] == 'init') {
      customLogger("setAppState -> init");
      appState.value = newState;
      fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.filled);
      staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.empty);
      resetFrames();
      resetGameScore();
    } else if (appStateEnum[newState] == 'runned') {
      customLogger("setAppState -> runned");
      appState.value = newState;
      setGameState(gameStateEnum.birth);
    } else if (appStateEnum[newState] == 'finished') {
      customLogger("setAppState -> finished");
      appState.value = newState;
      setGameState(gameStateEnum.nothing);
      setTimeout(() => {
      }, 2000);
    }
  }
  function setGameState(newState: gameStateEnum) {
    customLogger("PREPARE TO set Game state to: " + gameStateEnum[newState] + "...");
    if (gameStateEnum[newState] == 'birth') {
      customLogger("setGameState -> birth");
      elementId.value = nextElementId.value;
      nextElementId.value = getRandomElementId(allElements.length, elementId.value);
      elementSpin.value = 0;
      prevElementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), -1];
      elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
      renderNewFrame([0,0]);
      if (gameState.value != gameStateEnum.nothing && gameState.value != gameStateEnum.movement) {
        customLogger('setGameState -> birth -> setGameState to movement');
        setGameState(gameStateEnum.movement);
      };
    } else if (gameStateEnum[newState] == 'movement') {
      customLogger("setGameState -> movement");
      gameState.value = newState;
      startFalling(fallingSpeed.value);
    } else if (gameStateEnum[newState] == 'collision') {
      customLogger("setGameState -> collision");
      updateCleaningState();
      if (cleaningState.value.byYAxis.length > 0) {
        clearAllIntervals();
        stopFalling();
        startCleaning(conf.cleaningSpeed);
        setGameState(gameStateEnum.cleaning);
      } else {
        setGameState(gameStateEnum.birth);
      }
    } else if (gameStateEnum[newState] == 'cleaning') {
      customLogger("setGameState -> cleaning");
      gameState.value = newState;
    } else if (gameStateEnum[newState] == 'nothing') {
      customLogger("setGameState -> nothing");
      gameState.value = newState;
      stopFalling();
    }
  }
  function updateGameScore(linesWasCleared: number) {
    customLogger("updateGameScore()");
    score.value += calculateScorePoints(linesWasCleared, speedLevel.value, conf.linesScore);
  }
  function resetGameScore() {
    customLogger("resetGameScore()");
    score.value = 0 
  }
  function updateFrames() {
    customLogger("updateFrames()");
    frames.value += 1;
  }
  function resetFrames() {
    customLogger("resetFrames()");
    frames.value = -1;
  }
  function backToPrevSpin() {
    customLogger("backToPrevSpin()");
    const nextSpin = elementSpin.value - 1;
    elementSpin.value = allElements[elementId.value][nextSpin] != undefined ? nextSpin : allElements[elementId.value].length - 1;
  }
  function updateSpin() {
    customLogger("updateSpin()");
    const nextSpin = elementSpin.value + 1;
    elementSpin.value = allElements[elementId.value][nextSpin] != undefined ? nextSpin : 0;
  }
  function renderNewFrame(relativeCoords: number[]) {
    customLogger("renderNewFrame()");
    // Saving previous coordinates values before updating them to the new state:
    const prevElementCoordsBackup = JSON.parse(JSON.stringify(prevElementCoords.value));
    const elementCoordsBackup = JSON.parse(JSON.stringify(elementCoords.value));
    elementCoordsUpdate(relativeCoords);
    // Rendering the next game frame:
    const result = renderFieldMatrix(staticMatrix.value, fieldMatrix.value, elementId.value, prevElementCoords.value, elementCoords.value, elementSpin.value);
    fieldMatrix.value = JSON.parse(JSON.stringify(result.matrix));
    // Updating frames value to refresh Vue components:
    updateFrames();
    // If we have an order to return to previous coordinates, let's do it:
    if (result.returnPrevCoords) {
      prevElementCoords.value = prevElementCoordsBackup;
      elementCoords.value = elementCoordsBackup;
    }
    // If the game is over:
    if (result.isGameOver !== undefined && result.isGameOver) {
      customLogger("renderNewFrame() -> isGameOver !!! app state set to finished");
      setAppState(appStateEnum.finished);
    // If the game still continues:
    } else {
      // If there was a "collision" event, use the current matrix state as the default (swap object and environment into the new environment):
      if (result.gameState == gameStateEnum.collision) {
        staticMatrix.value = JSON.parse(JSON.stringify(result.matrix));
      }
      // Change the game state if we have this order:
      if (result.gameState != gameState.value) {
        customLogger("renderNewFrame -> setGameState to " + gameStateEnum[result.gameState]);
        setGameState(result.gameState);
      }
      // Set previous coordinates as current coordinates if needed:
      if (result.returnPrevSpin) {
        backToPrevSpin();
      }
    }
  }
  function renderNewCleaningFrame() {
    customLogger("renderNewCleaningFrame()");
    const result = renderCleanedFieldMatrix(staticMatrix.value, cleaningState.value);
    staticMatrix.value = result.nextStaticMatrix;
    fieldMatrix.value = result.nextStaticMatrix;
    cleaningState.value = result.nextCleaningState;
    // If cleaning is over:
    if (result.nextCleaningState.byXAxis.length == 0) {
      customLogger("renderNewCleaningFrame() -> cleaning is over");
      stopCleaning();
      const newStaticMatrix = combineStaticMatrixPartsInOne({ staticMatrix: result.nextStaticMatrix, lines: result.nextCleaningState.byYAxis });
      staticMatrix.value = newStaticMatrix;
      fieldMatrix.value = newStaticMatrix;
      setTimeout(() => {
        const linesErased = result.nextCleaningState.byYAxis.length;
        linesErasedCounter.value += linesErased;
        updateGameScore(linesErased);
        updateSpeedLevel();
        setGameState(gameStateEnum.birth);
      }, conf.cleaningSpeed);
    // Else - to continue cleaning process:
    } else {
      customLogger("renderNewCleaningFrame() -> continue cleaning...");
      staticMatrix.value = result.nextStaticMatrix;
      fieldMatrix.value = result.nextStaticMatrix;
    }
    updateFrames();
  }
  function clearAllIntervals() {
    const keysOfIntervals = Object.keys(keyInterval.value);
    for(let key of keysOfIntervals) {
      if (keyInterval.value[key] !== undefined) {
        clearInterval(keyInterval.value[key]);
        keyInterval.value[key] = undefined;
      }
    }
  }
  function updateSpeedLevel() {
    customLogger("updateSpeedLevel()");
    if (linesErasedCounter.value >= 10) {
      linesErasedCounter.value -= 10;
      increaseSpeedLevel();
    }
  }
  function elementCoordsUpdate(relativeCoords: number[]) {
    customLogger("elementCoordsUpdate()");
    prevElementCoords.value = JSON.parse(JSON.stringify(elementCoords.value));
    elementCoords.value[0] += relativeCoords[0];
    elementCoords.value[1] += relativeCoords[1];
  }
  function updateCleaningState() {
    customLogger("updateCleaningState()");
    cleaningState.value = getCleaningStateByStaticMatrix(staticMatrix.value);
  }
  function balanceMovementSpeed(movementSpeedValue: number) {
    customLogger("balanceMovementSpeed()");
    return JSON.parse(JSON.stringify((fallingSpeed.value > movementSpeedValue ? conf.movementSpeed : fallingSpeed.value)));
  }
  function setSpeedLevel(newSpeedLevelValue: number) {
    customLogger("setSpeedLevel()");
    speedLevel.value = newSpeedLevelValue;
    fallingSpeed.value = calculateFallingSpeed(newSpeedLevelValue, conf.speedIncreaseFactor);
    movementSpeed.value = balanceMovementSpeed(movementSpeed.value);
  }
  function increaseSpeedLevel() {
    customLogger("increaseSpeedLevel()");
    setSpeedLevel(speedLevel.value + 1);
  }

  return { 
    getWidth, 
    getWidthRef, 
    getHeight,
    getHeightRef,
    getWidthPixelsRef,
    getHeightPixelsRef,
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
    getNextElementId,
    getSpeedLevel,
    getLinesErasedCounter,
    isEnableLogger,
    goToNextAppState,
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
    setSpeedLevel
  }
});
