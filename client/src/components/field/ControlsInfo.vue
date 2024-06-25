<script setup lang='ts'>
import { appStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
import { computed } from 'vue';
const tetrisStore = useTetrisStore();

const showInfo = computed(() => tetrisStore.getAppState == appStateEnum['init']);
const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());
</script>

<template>
  <div v-if="showInfo" class="sub-field" :style="{ width: widthPixels.value + 'px', height: heightPixels.value + 'px'}">
    <div :class="['sub-field-in', {'show-info': showInfo}]">
      <p><span class="awesome"><font-awesome-icon icon="keyboard" style="font-size: 22px" /></span>&nbsp;&nbsp;Use the <span class='bold'>KEYBOARD</span> to play the game</p>
      <p><span class="key"><span class="key-in">↓</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press the <span class='bold'>DOWN ARROW</span> to move down</p>
      <p><span class="key"><span class="key-in">←</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press the <span class='bold'>LEFT ARROW</span> to move left</p>
      <p><span class="key"><span class="key-in">→</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press the <span class='bold'>RIGHT ARROW</span> to move right</p>
      <p><span class="key"><span class="key-in">␣</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press <span class='bold'>SPACE</span> to rotate an element</p>
      <p><span class="key"><span class="key-in">⇧</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press <span class='bold'>SHIFT</span> to start or end the game</p>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>
