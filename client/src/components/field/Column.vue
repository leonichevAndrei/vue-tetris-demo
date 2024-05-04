<script setup lang='ts'>
import Element from './Element.vue'
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
const props = defineProps(['x']);
</script>

<template>
  <div class="column">
    <Element :x="props.x" :y="index" v-for="index in tetrisStore.getWidth" />
  </div>
</template>

<style scoped>
</style>