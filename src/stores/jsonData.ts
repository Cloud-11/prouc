import { defineStore } from "pinia";
import { computed, reactive, Ref, toRefs } from "vue";
import { Block, BlockAttr, DATA_JSON, MaskArea } from "../index.d";
import data from "../data.json";
import { collide } from "@/utils";

export const useJsonDataStore = defineStore("JsonData", () => {
  const JsonData: DATA_JSON = reactive(data as unknown as DATA_JSON);
  const { container, blocks } = toRefs(JsonData);
  blocks.value = new Map<number, Block>();
  let ID_NUM = 0;
  //添加
  function addBlock(block: Block) {
    ID_NUM++;
    block.id = ID_NUM;
    blocks.value.set(ID_NUM, block);
  }
  //移除
  function removeBlock(id: number) {
    blocks.value.delete(id);
  }
  //修改
  function modifyBlock(id: number, attr: BlockAttr, value: string | number | boolean) {
    ((blocks.value.get(id) as Block)[attr] as string | number | boolean) = value;
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
  //清除选中
  function clearFocusBlock() {
    focusAndBlocks.value.focusBlocks.forEach(block => {
      modifyBlock(block.id, "focus", false);
    });
  }
  //多选
  function multipleBlock(maskArea: Ref<MaskArea>) {
    blocks.value.forEach(block => {
      if (collide(block, maskArea)) {
        modifyBlock(block.id, "focus", true);
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
