<script setup lang='ts'>
import { useTetrisStore } from '@/stores/tetris';
import { computed } from 'vue';
const tetrisStore = useTetrisStore();

const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());
</script>

<template>
  <div class="sub-field" :style="{ width: widthPixels.value + 'px', height: heightPixels.value + 'px'}">
    <div class="sub-field-in">
    ControlsInfo
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>