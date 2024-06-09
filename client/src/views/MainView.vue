<script setup lang='ts'>
import { ref, watch, computed, type Ref } from 'vue';
import ControlPanel from '../components/settings/ControlPanel.vue'
import Field from '../components/field/Field.vue'
import { appStateEnum, gameStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
import { useKeyupEvent } from '@/utills/common.utills';
const tetrisStore = useTetrisStore();

let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
const width = ref(tetrisStore.getWidth);
const height = ref(tetrisStore.getHeight);

watch(tetrisStore.getWidthRef(), newWidth => {
  width.value = newWidth;
});

watch(tetrisStore.getHeightRef(), newHeight => {
  height.value = newHeight;
});

watch(tetrisStore.getGameStateRef(), gameState => {
  if (gameStateEnum[gameState] == 'nothing') {
    tetrisStore.stopFalling();
  } else if (gameStateEnum[gameState] == 'movement') {
    tetrisStore.startFalling(tetrisStore.getFallingSpeed);
  } else if (gameStateEnum[gameState] == 'collision') {
    console.log('collision_in_mainView');
  } else if (gameStateEnum[gameState] == 'cleaning') {
    
  } else if (gameStateEnum[gameState] == 'finished') {

  }
});

watch(() => tetrisStore.getKeyPressed.ArrowUp, key => stopFallingWhileKeyDown(key));
watch(() => tetrisStore.getKeyPressed.ArrowDown, key => stopFallingWhileKeyDown(key));

useKeyupEvent((event: KeyboardEvent) => {
  if (event.type === 'keydown') {
    tetrisStore.getKeyPressed[event.code] = true;
    if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
      if (!tetrisStore.getKeyInterval[event.code]) {
        handleKeyPress(event.code);
        tetrisStore.getKeyInterval[event.code] = setInterval(() => 
          event.code !== "Space" ? handleKeyPress(event.code) : {}, 
          (event.code === "ArrowLeft" || event.code === "ArrowRight") ? tetrisStore.getSideSpeed : tetrisStore.getMovementSpeed
        );
      }
    }
  } else if (event.type === 'keyup') {
    tetrisStore.getKeyPressed[event.code] = false;
    if (tetrisStore.getKeyInterval[event.code]) {
      clearInterval(tetrisStore.getKeyInterval[event.code]!);
      tetrisStore.getKeyInterval[event.code] = null;
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

function stopFallingWhileKeyDown(keyState: boolean) {
  if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
    if (keyState === true) {
      tetrisStore.stopFalling();
    } else if (keyState === false) {
      tetrisStore.startFalling(tetrisStore.getFallingSpeed);
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
