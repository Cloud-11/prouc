import { Block } from "@prouc/shared";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useGlobalDataStore = defineStore("globalDataStore", () => {
  const markLine: Ref<{ x: number | null; y: number | null }> = ref({ x: null, y: null });
  function setMarkLine(value: { x: number | null; y: number | null }) {
    markLine.value = value;
  }

  let clipboard: Ref<Block[]> = ref([]);
  let copyMousePos = ref({ x: 0, y: 0, copyScale: 1, copyNum: 0 });

  return { markLine, setMarkLine, clipboard, copyMousePos,  };
});
