<script setup lang='ts'>
const props = defineProps(['x', 'y']);
</script>

<template>
  <div class='element'>{{ props.x }}.{{ props.y }}
  </div>
</template>

<style scoped>
</style>