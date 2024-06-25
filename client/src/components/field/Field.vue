<script setup lang='ts'>
import Column from './Column.vue';
import ControlsInfo from './ControlsInfo.vue';
import GameOver from './GameOver.vue';
import { appStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
const props = defineProps(['width', 'height']);
</script>

<template>
  <div class='field'>
    <GameOver v-if="appStateEnum[tetrisStore.getAppState]=='finished'" />
    <Column :x="index-1" v-for="index in props.height" :width="props.width" />
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>
