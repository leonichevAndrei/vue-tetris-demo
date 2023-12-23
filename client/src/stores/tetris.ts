import { defineStore } from "pinia"
import { ref } from "vue"

export const useTetrisStore = defineStore('tetris', () => {

  // STATE:
  const width = ref(10);
  const height = ref(20);

  // GETTERS:
  const getWidth = () => width.value;
  const getHeight = () => height.value;

  // ACTIONS:
  function setWidth() {
    width.value++;
  }
  function setHeight() {
    height.value++;
  }

  return { 
    getWidth, 
    getHeight,
    setWidth,
    setHeight 
  }
});
