<script setup lang='ts'>
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
</script>

<template>
  <div class="game-over">
    <p class="title">GAME OVER</p>
    <p>Final score: {{ tetrisStore.getScore }}</p>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>