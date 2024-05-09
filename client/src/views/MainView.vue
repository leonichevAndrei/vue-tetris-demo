<script setup lang='ts'>
import { ref, watch, computed } from 'vue';
import conf from '@/config/tetris.config.ts';
import ControlPanel from '../components/settings/ControlPanel.vue'
import Field from '../components/field/Field.vue'
import { appStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
import { getMillisecondsByFPS } from '@/utills/common.utills';
import { generateFieldTypes } from "@/config/tetris.enums";
const tetrisStore = useTetrisStore();

let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
let intervalID: number;
const width = ref(tetrisStore.getWidth);
const height = ref(tetrisStore.getHeight);

watch(tetrisStore.getWidthRef(), newWidth => {
  width.value = newWidth;
});

watch(tetrisStore.getHeightRef(), newHeight => {
  height.value = newHeight;
});

watch(tetrisStore.getAppStateRef(), appState => {
  if (appStateEnum[appState] == 'init') {
    tetrisStore.createAnyFieldMatrix(generateFieldTypes['filled']);
    tetrisStore.resetFrames();
  } else if (appStateEnum[appState] == 'runned') {
    intervalID = setInterval(() => tetrisStore.updateFrames(), getMillisecondsByFPS(conf.fps));
  } else if (appStateEnum[appState] == 'finished') {
    clearInterval(intervalID);
    tetrisStore.createAnyFieldMatrix(generateFieldTypes['empty']);
    tetrisStore.updateFrames();
  }
});

watch(tetrisStore.getFramesRef(), frames => {
  if (appStateEnum[tetrisStore.getAppState] == 'runned') {
    tetrisStore.createAnyFieldMatrix(generateFieldTypes['random']);
  }
});
</script>

<template>
  <div class='main-view' :id="templateIdForUpdate">
    <ControlPanel />
    <Field :width="width" :height="height" />
  </div>
</template>

<style scoped>
</style>