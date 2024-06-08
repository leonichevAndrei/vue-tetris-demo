<script setup lang='ts'>
import { ref, watch, computed, type Ref } from 'vue';
import ControlPanel from '../components/settings/ControlPanel.vue'
import Field from '../components/field/Field.vue'
import { appStateEnum, gameStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
import { useKeyupEvent } from '@/utills/common.utills';
const tetrisStore = useTetrisStore();

let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
let intervalIdFalling: number | null;
const width = ref(tetrisStore.getWidth);
const height = ref(tetrisStore.getHeight);
const keysPressed: Ref<{ [key: string]: boolean }> = ref({ ArrowUp: false, ArrowLeft: false, ArrowRight: false, ArrowDown: false, Space: false });
const keyIntervals: Ref<{ [key: string]: number | null }> = ref({ ArrowUp: null, ArrowLeft: null, ArrowRight: null, ArrowDown: null, Space: null });

watch(tetrisStore.getWidthRef(), newWidth => {
  width.value = newWidth;
});

watch(tetrisStore.getHeightRef(), newHeight => {
  height.value = newHeight;
});

watch(tetrisStore.getGameStateRef(), gameState => {
  if (gameStateEnum[gameState] == 'nothing') {
    stopFalling();
    if (intervalIdFalling !== null) clearInterval(intervalIdFalling);
  } else if (gameStateEnum[gameState] == 'movement') {
    startFalling();
  } else if (gameStateEnum[gameState] == 'collision') {
    console.log('collision_in_mainView');
  } else if (gameStateEnum[gameState] == 'cleaning') {
    
  } else if (gameStateEnum[gameState] == 'finished') {

  }
});

watch(() => keysPressed.value.ArrowUp, key => stopFallingWhileKeyDown(key));
watch(() => keysPressed.value.ArrowDown, key => stopFallingWhileKeyDown(key));

useKeyupEvent((event: KeyboardEvent) => {
  if (event.type === 'keydown') {
    keysPressed.value[event.code] = true;

    if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
      if (!keyIntervals.value[event.code]) {
        handleKeyPress(event.code);
        keyIntervals.value[event.code] = setInterval(() => 
          event.code !== "Space" ? handleKeyPress(event.code) : {}, 
          (event.code === "ArrowLeft" || event.code === "ArrowRight") ? tetrisStore.getSideSpeed : tetrisStore.getMovementSpeed
        );
      }
    }
  } else if (event.type === 'keyup') {
    keysPressed.value[event.code] = false;

    if (keyIntervals.value[event.code]) {
      clearInterval(keyIntervals.value[event.code]!);
      keyIntervals.value[event.code] = null;
    }
  }
});

function handleKeyPress(key: string) {
  if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
    switch (key) {
      case 'ArrowUp':
        tetrisStore.renderNewFrame([0, -1]);
        break;
      case 'ArrowLeft':
        tetrisStore.renderNewFrame([-1, 0]);
        break;
      case 'ArrowRight':
        tetrisStore.renderNewFrame([1, 0]);
        break;
      case 'ArrowDown':
        tetrisStore.renderNewFrame([0, 1]);
        break;
      case 'Space':
        tetrisStore.updateSpin();
        tetrisStore.renderNewFrame([0, 0]);
        break;
    }
  }
}

function startFalling() {
  intervalIdFalling = setInterval(() => tetrisStore.renderNewFrame([0,1]), tetrisStore.getFallingSpeed);
}

function stopFalling() {
  if (intervalIdFalling !== null) clearInterval(intervalIdFalling!);
  intervalIdFalling = null;
}

function stopFallingWhileKeyDown(keyState: boolean) {
  if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
    if (keyState === true) {
      stopFalling();
    } else if (keyState === false) {
      startFalling();
    }
  }
}
</script>

<template>
  <div class='main-view' :id="templateIdForUpdate">
    <ControlPanel />
    <Field :width="width" :height="height" />
  </div>
</template>

<style scoped>
</style>
