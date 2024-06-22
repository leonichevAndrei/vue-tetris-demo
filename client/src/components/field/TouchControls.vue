<script setup lang='ts'>
import { computed } from 'vue';
import { triggerKeyUpEvent, triggerKeyDownEvent, useKeyEvents } from '@/utills/key.events.utills';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();

const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());
useKeyEvents();
</script>

<template>
  <div class="touch-controls" :style="{ width: widthPixels.value + 'px', height: heightPixels.value + 'px'}">
    <div class="touch-controls-in">
      <div class="top">
        <div class="arrowLeft">
          <button 
            @touchstart="triggerKeyDownEvent('ArrowLeft')" 
            @touchend="triggerKeyUpEvent('ArrowLeft')" 
            @mousedown="triggerKeyDownEvent('ArrowLeft')" 
            @mouseup="triggerKeyUpEvent('ArrowLeft')">
          </button>
        </div>
        <div class="space">
          <button 
            @touchstart="triggerKeyDownEvent('Space')" 
            @touchend="triggerKeyUpEvent('Space')" 
            @mousedown="triggerKeyDownEvent('Space')" 
            @mouseup="triggerKeyUpEvent('Space')">
          </button>
        </div>
        <div class="arrowRight">
          <button 
            @touchstart="triggerKeyDownEvent('ArrowRight')" 
            @touchend="triggerKeyUpEvent('ArrowRight')" 
            @mousedown="triggerKeyDownEvent('ArrowRight')" 
            @mouseup="triggerKeyUpEvent('ArrowRight')">
          </button>
        </div>
      </div>
      <div class="arrowDown">
        <button 
          @touchstart="triggerKeyDownEvent('ArrowDown')" 
          @touchend="triggerKeyUpEvent('ArrowDown')" 
          @mousedown="triggerKeyDownEvent('ArrowDown')" 
          @mouseup="triggerKeyUpEvent('ArrowDown')">
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>