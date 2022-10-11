import { ref, Ref } from "vue";
import { Block, DATA_JSON, MaskArea } from "..";
import { clearFocusBlocks } from "./useBlockEvent";

export const useContentEvent = (clearFocusBlock: Function, multipleBlock: Function) => {
  //渲染组件框选
  let is_show_mask = ref(false);

  let maskArea: Ref<MaskArea> = ref({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });
  const contentMousedown = (
    e: MouseEvent,
    contentRef: Ref,
    markLine: Ref<{ x: number | null; y: number | null }>
  ) => {
    clearFocusBlocks(clearFocusBlock, markLine);

    //记录初始位置\
    let startPos = {
      x: e.clientX,
      y: e.clientY,
      cx: e.clientX - e.offsetX,
      cy: e.clientY - e.offsetY,
    };

    //绘制框选遮罩
    is_show_mask.value = true;
    maskArea.value.top = startPos.y - startPos.cy;
    maskArea.value.left = startPos.x - startPos.cx;
    const contentMousemove = (e: MouseEvent) => {
      maskArea.value = {
        width: Math.abs(e.clientX - startPos.x),
        height: Math.abs(e.clientY - startPos.y),
        top: (e.clientY <= startPos.y ? e.clientY : startPos.y) - startPos.cy,
        left: (e.clientX <= startPos.x ? e.clientX : startPos.x) - startPos.cx,
      };
    };
    const contentMouseup = () => {
      is_show_mask.value = false;
      multipleBlock(maskArea);
      // JsonData.blocks.forEach(block => {
      //   if (collide(block, maskStyle)) {
      //     block.focus = true;
      //   }
      // });

      maskArea.value = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      };

      contentRef.value.removeEventListener("mousemove", contentMousemove);
      contentRef.value.removeEventListener("mouseup", contentMouseup);
    };
    contentRef.value.addEventListener("mousemove", contentMousemove);
    contentRef.value.addEventListener("mouseup", contentMouseup);
  };
  return { contentMousedown, maskArea, is_show_mask };
};
