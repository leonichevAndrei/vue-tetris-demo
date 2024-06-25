<script setup lang='ts'>
import { computed } from 'vue';
import { useTetrisStore } from '@/stores/tetris';
const tetrisStore = useTetrisStore();

const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());
</script>

<template>
  <div class="sub-field" :style="{ width: widthPixels.value + 'px', height: heightPixels.value + 'px'}">
    <div class="sub-field-in game-over">
      <p class="title">GAME OVER</p>
      <p class="score">Final score: <span>{{ tetrisStore.getScore }}</span></p>
      <p class="record">IT'S A NEW RECORD!</p>
      <p class="enter-name">Please, enter your name:</p>
      <p class="for-input"><input type="text" value="Andrei Leonichev" />&nbsp;<button>Send</button></p>
      <p class="leaderboard">LEADERBOARD:</p>
      <!-- <p class="list"><ol>
        <li><span class="name">Mickey Rourke:</span>      <span class="points">1000</span> points</li>
        <li><span class="name">Serious Sam:</span>        <span class="points">2000</span> points</li>
        <li><span class="name">Walter Sallivan:</span>    <span class="points">3000</span> points</li>
        <li><span class="name">Paul Mc Curtney:</span>    <span class="points">4000</span> points</li>
        <li><span class="name">Jenifer Lopez:</span>      <span class="points">5000</span> points</li>
        <li><span class="name">Yuri Shevchuk:</span>      <span class="points">6000</span> points</li>
        <li><span class="name">Silvester Stallone:</span> <span class="points">7000</span> points</li>
        <li><span class="name">Harry Potter:</span>       <span class="points">8000</span> points</li>
        <li><span class="name">Sergei Lukyanenko:</span>  <span class="points">9000</span> points</li>
        <li><span class="name">Ivan Durak:</span>         <span class="points">10000</span> points</li>
      </ol></p> -->
      <p class="list">
        <table cellspacing="0" cellpadding="0">
          <tr>
            <td class="number">1.</td>
            <td class="name">Mickey Rourke</td>
            <td class="points">1000</td>
          </tr>
          <tr>
            <td class="number">2.</td>
            <td class="name">Serious Sam</td>
            <td class="points">2000</td>
          </tr>
          <tr>
            <td class="number">3.</td>
            <td class="name">Walter Sallivan</td>
            <td class="points">3000</td>
          </tr>
          <tr>
            <td class="number">4.</td>
            <td class="name">Paul Mc Curtney</td>
            <td class="points">4000</td>
          </tr>
          <tr>
            <td class="number">5.</td>
            <td class="name">Jenifer Lopez</td>
            <td class="points">5000</td>
          </tr>
          <tr>
            <td class="number">6.</td>
            <td class="name">Yuri Shevchuk</td>
            <td class="points">6000</td>
          </tr>
          <tr>
            <td class="number">7.</td>
            <td class="name">Silvester Stallone</td>
            <td class="points">7000</td>
          </tr>
          <tr>
            <td class="number">8.</td>
            <td class="name">Harry Potter</td>
            <td class="points">8000</td>
          </tr>
          <tr>
            <td class="number">9.</td>
            <td class="name">Sergei Lukyanenko</td>
            <td class="points">9000</td>
          </tr>
          <tr>
            <td class="number">10.</td>
            <td class="name">Ivan Durak</td>
            <td class="points">10000</td>
          </tr>
        </table>
      </p> 
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>