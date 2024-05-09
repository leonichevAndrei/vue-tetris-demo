<script setup lang='ts'>
import { watch, computed } from 'vue';
import conf from '@/config/tetris.config.ts';
import ControlPanel from '../components/settings/ControlPanel.vue'
import Field from '../components/field/Field.vue'
import GameOver from '@/components/field/GameOver.vue';
import { appStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
import { getMillisecondsByFPS } from '@/utills/common.utills';
const tetrisStore = useTetrisStore();

let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
let intervalID: number;

watch(tetrisStore.getAppStateRef(), appState => {
  if (appStateEnum[appState] == 'runned') {
    tetrisStore.createFieldMatrix();
    intervalID = setInterval(() => tetrisStore.updateFrames(), getMillisecondsByFPS(conf.fps));
  }
  if (intervalID !== null && appStateEnum[appState] == 'finished') {
    clearInterval(intervalID);
    tetrisStore.resetFrames();
  }
});

watch(tetrisStore.getFramesRef(), frames => {
  tetrisStore.createRandomFieldMatrix();
});
</script>

<template>
  <div class='main-view' :id="templateIdForUpdate">
    <ControlPanel />
    <Field v-if="appStateEnum[tetrisStore.getAppState]!='finished'" />
    <GameOver v-if="appStateEnum[tetrisStore.getAppState]=='finished'" />
  </div>
</template>

<style scoped>
</style>