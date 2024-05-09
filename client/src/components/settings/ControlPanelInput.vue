<script setup lang='ts'>
import { ref, watch } from 'vue';

const props = defineProps(['title', 'range', 'value', 'updateStoreFunc']);
const inputValue = ref(props.value);

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
  if (parsedValue > props.range.max) {
    inputValue.value = props.range.max;
  }
}
function checkInputOnFocus() {
  if (inputValue.value == '0') inputValue.value = '';
}
function checkInputOnBlur() {
  if (inputValue.value == '') {
    inputValue.value = props.range.min;
  } else {
    const parsedValue = parseInt(inputValue.value);
    checkMinMax(parsedValue);
  }
}
function checkMinMax(parsedValue: number) {
  if (parsedValue < props.range.min) {
    inputValue.value = props.range.min;
  } else if (parsedValue > props.range.max) {
    inputValue.value = props.range.max;
  }
}

watch(inputValue, (newInputValue) => {
  if (newInputValue >= props.range.min) {
    props.updateStoreFunc(parseInt(newInputValue));
  }
})
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
