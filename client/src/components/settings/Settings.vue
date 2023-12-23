<script setup lang='ts'>
import SettingsNumItem from './SettingsNumItem.vue';
import { useTetrisStore } from '@/stores/tetris';
import conf from '@/config/tetris.config.ts';
const tetrisStore = useTetrisStore();
</script>

<template>
  <div class='menu'>
    <SettingsNumItem title='Width' :range="conf.width" :updateStoreFunc="tetrisStore.setWidth" />
    <SettingsNumItem title='Height' :range="conf.height" :updateStoreFunc="tetrisStore.setHeight" />
  </div>
</template>

<style>
@import '../../assets/style/menu.css';
</style>
