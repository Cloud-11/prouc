import { defineStore } from "pinia";
import { ref } from "vue";

export const useRightMenuStore = defineStore("rightMenu", () => {
  const showMenu = ref(true);
  function hiddenMenu() {
    showMenu.value = false;
  }
  function showsMenu() {
    showMenu.value = true;
  }

  return { showMenu, hiddenMenu, showsMenu };
});
