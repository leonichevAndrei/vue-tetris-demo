<script setup lang='ts'>
import { computed } from 'vue';
import { triggerKeyEvent } from '@/utills/common.utills';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();

const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());
</script>

<template>
  <div class="touch-controls" :style="{ width: widthPixels.value + 'px', height: heightPixels.value + 'px'}">
    <div class="touch-controls-in">
      <div class="top">
        <div class="arrowLeft"><button @click="triggerKeyEvent('ArrowLeft')"></button></div>
        <div class="space"><button @click="triggerKeyEvent('Space')"></button></div>
        <div class="arrowRight"><button @click="triggerKeyEvent('ArrowRight')"></button></div>
      </div>
      <div class="arrowDown"><button @click="triggerKeyEvent('ArrowDown')"></button></div>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>