import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useRightMenuStore = defineStore("rightMenu", () => {
  let showMenu = ref(false);
  function hiddenMenu() {
    showMenu.value = false;
  }
  function showsMenu() {
    showMenu.value = true;
  }

  const menuPos = reactive({ top: 0, left: 0 });
  function setMenuPos(value: { top: number; left: number }) {
    menuPos.top = value.top;
    menuPos.left = value.left;
  }

  return { showMenu, hiddenMenu, showsMenu, menuPos, setMenuPos };
});
