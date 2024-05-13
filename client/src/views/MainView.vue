<script setup lang='ts'>
import { ref, watch, computed } from 'vue';
import ControlPanel from '../components/settings/ControlPanel.vue'
import Field from '../components/field/Field.vue'
import { appStateEnum, gameStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
import { useKeyupEvent } from '@/utills/common.utills';
const tetrisStore = useTetrisStore();

let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
let intervalIdFalling: number;
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
    if (intervalIdFalling !== null) clearInterval(intervalIdFalling);
  } else if (gameStateEnum[gameState] == 'movement') {
    if (intervalIdFalling !== null) {
      intervalIdFalling = setInterval(() => tetrisStore.renderNewFrame([0,1]), tetrisStore.getFallingSpeed);
    }
  } else if (gameStateEnum[gameState] == 'collision') {
    console.log('collision_in_mainView');
  } else if (gameStateEnum[gameState] == 'cleaning') {
    
  } else if (gameStateEnum[gameState] == 'finished') {

  }
});

useKeyupEvent( (event: KeyboardEvent) => {
  if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
    if (event.code == 'ArrowUp') {
      tetrisStore.renderNewFrame([0,-1]);
    }
    if (event.code == 'ArrowLeft') {
      tetrisStore.renderNewFrame([-1,0]);
    }
    if (event.code == 'ArrowRight') {
      tetrisStore.renderNewFrame([1,0]);
    }
    if (event.code == 'ArrowDown') {
      tetrisStore.renderNewFrame([0,1]);
    }
    if (event.code == 'Space') {
      tetrisStore.updateSpin();
      tetrisStore.renderNewFrame([0,0]);
    }
  }
})
</script>

<template>
  <div class='main-view' :id="templateIdForUpdate">
    <ControlPanel />
    <Field :width="width" :height="height" />
  </div>
</template>

<style scoped>
</style>