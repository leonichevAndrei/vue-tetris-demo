<script setup lang='ts'>
import Element from './Element.vue'
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
const props = defineProps(['x', 'width']);
</script>

<template>
  <div class="column">
    <Element :x="props.x" :y="index-1" v-for="index in props.width" />
  </div>
</template>

<style scoped>
</style>