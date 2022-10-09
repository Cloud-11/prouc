import { ref, Ref } from "vue";
import { Block, DATA_JSON } from "..";
import { clearFocusBlocks } from "./useBlockEvent";

export const useContentEvent = (JsonData: Ref<DATA_JSON>) => {
  //渲染组件框选
  let is_show_mask = ref(false);

  let maskStyle = ref({ width: "0", height: "0", top: "0", left: "0" });
  const contentMousedown = (
    e: MouseEvent,
    contentRef: Ref,
    markLine: Ref<{ x: number | null; y: number | null }>
  ) => {
    clearFocusBlocks(JsonData, markLine);

    //记录初始位置\
    let startPos = {
      x: e.clientX,
      y: e.clientY,
      cx: e.clientX - e.offsetX,
      cy: e.clientY - e.offsetY,
    };

    //绘制框选遮罩
    is_show_mask.value = true;
    maskStyle.value.top = startPos.y - startPos.cy + "px";
    maskStyle.value.left = startPos.x - startPos.cx + "px";
    const contentMousemove = (e: MouseEvent) => {
      maskStyle.value = {
        width: `${Math.abs(e.clientX - startPos.x)}px`,
        height: `${Math.abs(e.clientY - startPos.y)}px`,
        top: `${(e.clientY <= startPos.y ? e.clientY : startPos.y) - startPos.cy}px`,
        left: `${(e.clientX <= startPos.x ? e.clientX : startPos.x) - startPos.cx}px`,
      };
    };
    const contentMouseup = () => {
      is_show_mask.value = false;
      JsonData.value.blocks.forEach(block => {
        if (collide(block, maskStyle)) {
          block.focus = true;
        }
      });

      maskStyle.value = {
        width: "0",
        height: "0",
        top: "0",
        left: "0",
      };

      contentRef.value.removeEventListener("mousemove", contentMousemove);
      contentRef.value.removeEventListener("mouseup", contentMouseup);
    };
    contentRef.value.addEventListener("mousemove", contentMousemove);
    contentRef.value.addEventListener("mouseup", contentMouseup);
  };
  return { contentMousedown, maskStyle, is_show_mask };
};

const collide = (rect1: Block, rect2: Ref) => {
  const { width, height, top, left } = rect2.value;
  const maxX = Math.max(rect1.left + rect1.width, toNumber(left) + toNumber(width));
  const maxY = Math.max(rect1.top + rect1.height, toNumber(top) + toNumber(height));
  const minX = Math.min(rect1.left, toNumber(left));
  const minY = Math.min(rect1.top, toNumber(top));
  if (
    maxX - minX <= rect1.width + toNumber(width) &&
    maxY - minY <= rect1.height + toNumber(height)
  ) {
    return true;
  } else {
    return false;
  }
};
const toNumber = (str: string) => {
  return parseFloat(str.replace("px", ""));
};
