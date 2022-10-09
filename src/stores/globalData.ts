import { defineStore } from "pinia";
import { Ref, ref } from "vue";
export const useGlobalDataStore = defineStore("globalDataStore", () => {
  const markLine: Ref<{ x: number | null; y: number | null }> = ref({ x: null, y: null });
  function setMarkLine(value: { x: number | null; y: number | null }) {
    markLine.value = value;
  }
  return { markLine, setMarkLine };
});
