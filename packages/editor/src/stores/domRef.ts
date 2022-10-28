import { defineStore } from "pinia";
import { Ref, ref } from "vue";
export const useDomRefStore = defineStore("DomRefStore", () => {
  const contentRef: Ref<HTMLElement | null> = ref(null);
  const containerRef: Ref<HTMLElement | null> = ref(null);
  function setContentRef(value: HTMLElement) {
    contentRef.value = value;
  }
  return { contentRef, containerRef, setContentRef };
});
