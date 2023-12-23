<script setup lang='ts'>
import Column from './Column.vue'
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
</script>

<template>
  <div class='field'>
    Width: {{ tetrisStore.getWidth() }} <br />
    Height: {{ tetrisStore.getHeight() }}<br />
    <Column />
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>