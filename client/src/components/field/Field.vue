<script setup lang='ts'>
import Column from './Column.vue'
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
</script>

<template>
  <div class='field'>
    <Column :x="index-1" v-for="index in tetrisStore.getHeight" />
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>