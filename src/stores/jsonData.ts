import { defineStore } from "pinia";
import { computed, reactive, Ref, toRefs } from "vue";
import { Block, DATA_JSON, MaskArea } from "../index.d";
import data from "../data.json";
import { collide } from "@/utils";
export const useJsonDataStore = defineStore("JsonData", () => {
  const JsonData: DATA_JSON = reactive(data);
  const { container, blocks } = toRefs(JsonData);

  function addBlock(block: Block) {
    blocks.value.push(block);
  }
  function removeBlock(block: Block | null, index: number) {
    if (!index) {
      index = blocks.value.indexOf(block as Block);
    }
    blocks.value.slice(index, 1);
  }
  function modifyBlock(index: number, block: Block) {
    blocks.value[index] = block;
  }
  //block选中
  const focusAndBlocks = computed(() => {
    const focusBlocks: Block[] = [];
    const unFocusBlocks: Block[] = [];
    blocks.value.forEach(block =>
      (block.focus ? focusBlocks : unFocusBlocks).push(block)
    );
    return {
      focusBlocks,
      unFocusBlocks,
      lastFocusBlock: focusBlocks[focusBlocks.length - 1],
    };
  });
  function clearFocusBlock() {
    blocks.value.forEach(block => (block.focus = false));
  }
  //多选
  function multipleBlock(maskArea: Ref<MaskArea>) {
    blocks.value.forEach(block => {
      if (collide(block, maskArea)) {
        block.focus = true;
      }
    });
  }
  return {
    container,
    blocks,
    focusAndBlocks,
    addBlock,
    removeBlock,
    modifyBlock,
    clearFocusBlock,
    multipleBlock,
  };
});
