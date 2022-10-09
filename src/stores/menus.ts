import rightMenus, { RightMenuOpts } from "@/utils/menusConfig";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";
export const useRightMenuOptsStore = defineStore("rightMenuOptsStore", () => {
  const menus: Ref<RightMenuOpts> = ref(rightMenus);

  return { menus };
});
