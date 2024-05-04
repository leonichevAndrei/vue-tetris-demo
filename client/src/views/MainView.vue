<script setup lang='ts'>
import { watch } from 'vue';
import ControlPanel from '../components/settings/ControlPanel.vue'
import Field from '../components/field/Field.vue'
import GameOver from '@/components/field/GameOver.vue';
import { appStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();

let intervalID: number;
watch(tetrisStore.getAppStateRef(), appState => {
  if (appStateEnum[appState] == 'runned') {
    intervalID = setInterval(() => tetrisStore.updateSteps(), 500);
  }
  if (intervalID !== null && appStateEnum[appState] == 'finished') {
    clearInterval(intervalID);
    tetrisStore.resetSteps();
  }
});

watch(tetrisStore.getStepsRef(), appState => {

});
</script>

<template>
  <div class='main-view'>
    <ControlPanel />
    <Field v-if="appStateEnum[tetrisStore.getAppState]!='finished'" />
    <GameOver v-if="appStateEnum[tetrisStore.getAppState]=='finished'" />
  </div>
</template>

<style scoped>
</style>