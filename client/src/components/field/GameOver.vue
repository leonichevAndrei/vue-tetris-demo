<script setup lang="ts">
import { computed, ref, onMounted, type Ref } from 'vue';
import { useTetrisStore } from '@/stores/tetris';
import axios from 'axios';
const tetrisStore = useTetrisStore();

const name = ref('');
const newRecord = ref(false);
const apiData: Ref<{ data: { name: string; points: number }[] }> = ref({
  data: [],
});
const widthPixels = computed(() => tetrisStore.getWidthPixelsRef());
const heightPixels = computed(() => tetrisStore.getHeightPixelsRef());

async function getData() {
  try {
    const response = await axios.get('/api/handleData');
    apiData.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateData() {
  try {
    const newData = { key: 'value' }; // Your update data
    const response = await axios.post('/api/handleData', newData);
    console.log('Update response:', response.data);
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function checkName() {
  if (name.value.length > 20) {
    name.value = name.value.substring(0, 20);
  }
  const regex = /^[A-Za-z\s]+$/;
  if (!regex.test(name.value)) {
    name.value = name.value.substring(0, name.value.length - 1);
  }
}

onMounted(() => getData());
</script>

<template>
  <div
    v-if="apiData.data.length > 0"
    class="sub-field"
    :style="{
      width: widthPixels.value + 'px',
      height: heightPixels.value + 'px',
    }"
  >
    <div class="sub-field-in game-over">
      <div class="title">GAME OVER</div>
      <div class="score">
        Final score:&nbsp;<span>{{ tetrisStore.getScore }}</span>
      </div>
      <div class="record">IT'S A NEW RECORD!</div>
      <div class="enter-name">Please, enter your name:</div>
      <div class="for-input">
        <input v-model="name" @input="checkName" type="text" />&nbsp;<button>
          Send
        </button>
      </div>
      <div class="leaderboard">LEADERBOARD:</div>
      <div class="list">
        <table cellspacing="0" cellpadding="0">
          <tr v-for="(entry, index) in apiData.data" :key="index">
            <td class="number">{{ index + 1 }}.</td>
            <td class="name">{{ entry.name }}</td>
            <td class="points">{{ entry.points }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
@import '../../assets/style/field.css';
</style>
