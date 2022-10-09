import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { Block, DATA_JSON } from "..";
import data from "../data.json";
export const useJsonDataStore = defineStore("JsonData", () => {
  const JsonData: Ref<DATA_JSON> = ref(data);

  function addBlock(block: Block) {
    JsonData.value.blocks.push(block);
  }
  function removeBlock(block: Block, index: number) {
    if (!index) {
      index = JsonData.value.blocks.indexOf(block);
    }
    JsonData.value.blocks.slice(index, 1);
  }

  return { JsonData, addBlock, removeBlock };
});
