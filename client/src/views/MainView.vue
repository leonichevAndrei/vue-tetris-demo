<script setup lang='ts'>
import { ref, watch, computed } from 'vue';
import conf from '@/config/tetris.config.ts';
import ControlPanel from '../components/settings/ControlPanel.vue'
import Field from '../components/field/Field.vue'
import { appStateEnum, gameStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
import { getMillisecondsByFPS } from '@/utills/common.utills';
import { generateFieldTypes } from "@/config/tetris.enums";
const tetrisStore = useTetrisStore();

let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
// let intervalIdFrames: number;
let intervalIdFalling: number;
const width = ref(tetrisStore.getWidth);
const height = ref(tetrisStore.getHeight);

watch(tetrisStore.getWidthRef(), newWidth => {
  width.value = newWidth;
});

watch(tetrisStore.getHeightRef(), newHeight => {
  height.value = newHeight;
});

// watch(tetrisStore.getAppStateRef(), appState => {
//   if (appStateEnum[appState] == 'runned') {
//     intervalIdFrames = setInterval(() => tetrisStore.updateFrames(), getMillisecondsByFPS(conf.fps));
//   } else if (appStateEnum[appState] == 'finished') {
//     clearInterval(intervalIdFrames);
//   }
// });

watch(tetrisStore.getGameStateRef(), gameState => {
  if (gameStateEnum[gameState] == 'nothing') {
    if (intervalIdFalling !== null) clearInterval(intervalIdFalling);
  } else if (gameStateEnum[gameState] == 'movement') {
    if (intervalIdFalling !== null) {
      intervalIdFalling = setInterval(() => tetrisStore.renderNewFrame([0,1]), tetrisStore.getFallingSpeed);
    }
    
  } else if (gameStateEnum[gameState] == 'collision') {
    
  } else if (gameStateEnum[gameState] == 'cleaning') {
    
  } else if (gameStateEnum[gameState] == 'finished') {

  }
})

// watch(tetrisStore.getFramesRef(), frames => {
//   if (appStateEnum[tetrisStore.getAppState] == 'runned') {
//     tetrisStore.createAnyFieldMatrix(generateFieldTypes['random']);
//   }
// });
</script>

<template>
  <div class='main-view' :id="templateIdForUpdate">
    <ControlPanel />
    <Field :width="width" :height="height" />
  </div>
</template>

<style scoped>
</style>