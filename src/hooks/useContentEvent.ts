import { ref, Ref, toRaw } from "vue";
import { clearFocusBlocks } from "./useBlockEvent";

export const useContentEvent = (clearFocusBlock: Function, multipleBlock: Function) => {
  const contentMousedown = (
    e: MouseEvent,
    contentRef: Ref,
    markLine: Ref<{ x: number | null; y: number | null }>
  ) => {
    e.stopPropagation();
    clearFocusBlocks(clearFocusBlock, markLine);

    //记录初始位置\

    const contentMousemove = (e: MouseEvent) => {};
    const contentMouseup = (e: MouseEvent) => {
      console.log(e);

      contentRef.value.removeEventListener("mousemove", contentMousemove);
      //鼠标移出区域 松手释放 选择区域
      window.removeEventListener("mouseup", contentMouseup);
    };
    contentRef.value.addEventListener("mousemove", contentMousemove);
    window.addEventListener("mouseup", contentMouseup);
  };
  // return { contentMousedown, maskArea, is_show_mask };
};
