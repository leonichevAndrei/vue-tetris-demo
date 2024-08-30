<script setup lang='ts'>
import { computed, onMounted, type Ref } from 'vue';
import ControlPanel from '@/components/settings/ControlPanel.vue'
import Field from '@/components/field//Field.vue'
import TouchControls from '@/components/field/TouchControls.vue';
import ControlsInfo from '@/components/field/ControlsInfo.vue';
import GameOver from '@/components/field/GameOver.vue';
import { appStateEnum } from '@/config/tetris.enums';
import { useKeyEvents } from '@/utills/key.events.utills';
import { useDimensionsChange } from '@/utills/hooks.utills';
import { isTouchDevice } from '@/utills/common.utills';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
let width: Ref<number>;
let height: Ref<number>;
let templateIdForUpdate = computed(() => 'mainViewId' + tetrisStore.getFramesRef().value);
[width, height] = useDimensionsChange(tetrisStore);
useKeyEvents();
onMounted(() => tetrisStore.fetchTopScoreDataAsync());
</script>

<template>
  <div class='main-view' :id="templateIdForUpdate">
    <ControlPanel />
    <Field :width="width" :height="height" />
    <TouchControls v-if="isTouchDevice()" />
    <ControlsInfo v-if="!isTouchDevice()" />
    <GameOver v-if="appStateEnum[tetrisStore.getAppState]=='finished'" />
  </div>
</template>

<style>
@import '../assets/style/control-panel.css';
@import '../assets/style/field.css';
@import '../assets/style/media.css';
</style>
