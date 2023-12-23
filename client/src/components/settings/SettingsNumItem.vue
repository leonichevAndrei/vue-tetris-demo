<script setup lang='ts'>
import { ref } from 'vue';

const props = defineProps(['title', 'range', 'updateStoreFunc']);
const inputValue = ref(props.range.min.toString());

function checkAndSetInputValue(event: any) {
  const value = event.target.value;
  const parsedValue = parseInt(value);
  if (parsedValue.toString() !== value) {
    if (parsedValue >= 0) {
        inputValue.value = parsedValue.toString();
    } else {
      inputValue.value = '';
    }
  }
}
function checkInputOnFocus() {
  if (inputValue.value == '0') inputValue.value = '';
}
function checkInputOnBlur() {
  if (inputValue.value == '') {
    inputValue.value = '0';
  } else {
    const parsedValue = parseInt(inputValue.value);
    if (parsedValue < props.range.min) {
      inputValue.value = props.range.min;
    } else if (parsedValue > props.range.max) {
      inputValue.value = props.range.max;
    }
  }
}
</script>

<template>
  <div class='menu-item'>
    <label>{{title}}:&nbsp;</label>
    <input 
      v-model='inputValue'
      @input='checkAndSetInputValue'
      @focus='checkInputOnFocus'
      @blur='checkInputOnBlur'
    />
  </div>
</template>
