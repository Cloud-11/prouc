import rightMenus, { RightMenuOpts } from "@/configs/menusConfig";
import { defineStore, storeToRefs } from "pinia";
import { Ref, ref } from "vue";
import _ from "lodash";
import { useJsonDataStore } from "./jsonData";
export type menusName = "blockMenus" | "blocksMenus" | "groupMenus" | "canvasMenus";
export const useRightMenuOptsStore = defineStore("rightMenuOptsStore", () => {
  const rightMenusData = rightMenus;
  const { groupOpts, copyOpts, moveOpts, otherOpts } = rightMenusData;
  //画布菜单
  const canvasMenus: RightMenuOpts = {
    copyOpts: [copyOpts[1]],
    otherOpts: [otherOpts[0]],
  };
  //block基础菜单
  const blockMenus: RightMenuOpts = {
    copyOpts,
    moveOpts,
    otherOpts,
  };
  //多选block菜单
  const blocksMenus: RightMenuOpts = _.merge({ groupOpts: [groupOpts[0]] }, blockMenus);
  //组合block菜单
  const groupMenus: RightMenuOpts = _.merge({ groupOpts: [groupOpts[1]] }, blockMenus);

  const map = {
    blockMenus,
    blocksMenus,
    groupMenus,
    canvasMenus,
  };

  const menus: Ref<RightMenuOpts> = ref(blockMenus);
  function setMenus(name: menusName) {
    const { focusAndBlocks } = storeToRefs(useJsonDataStore());
    const { focusBlocks } = focusAndBlocks.value;
    if (name === "blockMenus") {
      focusBlocks.length > 1 && focusBlocks.every(block => block.type !== "group")
        ? (name = "blocksMenus")
        : "";
    } else if (name === "groupMenus") {
      focusBlocks.length != 1 ? (name = "blockMenus") : "";
    }
    return (menus.value = map[name]);
  }

  return { menus, setMenus };
});
