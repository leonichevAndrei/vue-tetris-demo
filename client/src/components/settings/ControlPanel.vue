<script setup lang='ts'>
import ControlPanelButton from './ControlPanelButton.vue';
import ControlPanelInput from './ControlPanelInput.vue';
import conf from '@/config/tetris.config.ts';
import { appStateEnum, gameStateEnum } from '@/config/tetris.enums';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();
</script>

<template>
  <div class='control-panel'>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='init'" class='line'>
      <ControlPanelInput title='Width' :range="conf.width" :value="tetrisStore.getWidth" :updateStoreFunc="tetrisStore.setWidth" />
      <ControlPanelInput title='Height' :range="conf.height" :value="tetrisStore.getHeight" :updateStoreFunc="tetrisStore.setHeight" />
    </div>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='init'" class='line'>
      <ControlPanelButton title='Start Game' :appState='appStateEnum.runned' />
    </div>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='runned'" class='line'>
      <ControlPanelButton title='End Game' :appState='appStateEnum.finished' />
    </div>
    <div v-if="appStateEnum[tetrisStore.getAppState]=='finished'" class='line'>
      <ControlPanelButton title='New Game' :appState='appStateEnum.init' />
    </div>
    <!-- <div class='line'>
      App state: {{ appStateEnum[tetrisStore.getAppState] }}
    </div>
    <div class='line'>
      Game state: {{ gameStateEnum[tetrisStore.getGameState] }}
    </div> -->
    <!-- <div class='line'>
      Width: {{ tetrisStore.getWidth }} / Height {{ tetrisStore.getHeight }}
    </div> -->
    <!-- <div class='line'>
      Coords: {{ "x: " + tetrisStore.getElementCoords[0] + " / y: " + tetrisStore.getElementCoords[1] + " (frames: " + tetrisStore.getFrames }})
    </div> -->
    <div class='line'>
      <div class='info'>
        <div class='left'>Speed:&nbsp;<span>16</span></div>
        <div class='center'>Score:&nbsp;<span>156980</span></div>
        <div class='right'>
          <div>Next:&nbsp;</div>
          <div class="elm2"><img src="../../assets/images/tetris-icons-2.png" /></div>
        </div>
      </div>
    </div>
    <!-- <div class='line info-line'>
      {{ `Score: 4200 | Speed: 16` }})
    </div> -->
  </div>
</template>

<style>
@import '../../assets/style/control-panel.css';
</style>
