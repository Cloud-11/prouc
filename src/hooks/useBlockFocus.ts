import { computed, ref, Ref } from "vue";
import { Block } from "..";
import { DATA_JSON } from "./../index.d";

export const useBlocsFocus = (data: Ref<DATA_JSON>) => {
  //block选中
  const focusBlocks = computed(() => {
    let focus: Block[] = [];
    let unFocused: Block[] = [];
    data.value.blocks.forEach(block => (block.focus ? focus : unFocused).push(block));
    return { focus, unFocused };
  });
  //清空focus
  const clearFocusBlocks = () => {
    data.value.blocks.forEach(block => (block.focus = false));
  };
  let blockStartPos = {
    x: 0,
    y: 0,
  };
  //移动所有选中的block
  const blockMousemove = (e: MouseEvent) => {
    const durx = e.clientX - blockStartPos.x;
    const dury = e.clientY - blockStartPos.y;
    //记录鼠标新位置
    blockStartPos = {
      x: e.clientX,
      y: e.clientY,
    };
    //移动所有选中的block
    focusBlocks.value.focus.forEach(block => {
      block.top += dury;
      block.left += durx;
    });
  };

  const blockMouseup = () => {
    document.removeEventListener("mousemove", blockMousemove);
    document.removeEventListener("mouseup", blockMouseup);
  };

  const blockMousedown = (e: MouseEvent, block: Block) => {
    e.preventDefault();
    e.stopPropagation();
    //非shift清空选择
    if (!e.shiftKey) {
      if (!block.focus) {
        clearFocusBlocks();
      }
    }
    //block被选中
    block.focus = true; //!block.focus;
    // if (block.focus) {
    //block选中添加拖拽事件
    document.addEventListener("mousemove", blockMousemove);
    document.addEventListener("mouseup", blockMouseup);
    //记录选中block的位置
    blockStartPos = {
      x: e.clientX,
      y: e.clientY,
    };
    // 渲染框选遮罩
  };

  //渲染组件框选
  let is_show_mask = ref(false);
  let startPos = {
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
  };
  let maskStyle = ref({ width: "0", height: "0", top: "0", left: "0" });

  const contentMousedown = (e: MouseEvent, contentRef: Ref, maskRef: Ref) => {
    clearFocusBlocks();

    const contentMouseup = () => {
      is_show_mask.value = false;
      console.log(maskRef.value.getClientRects());
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
    //记录初始位置
    startPos = {
      x: e.clientX,
      y: e.clientY,
      cx: e.clientX - e.offsetX,
      cy: e.clientY - e.offsetY,
    };
    //绘制框选遮罩
    is_show_mask.value = true;
    maskStyle.value.top = startPos.y - startPos.cy + "px";
    maskStyle.value.left = startPos.x - startPos.cx + "px";
  };
  const contentMousemove = (e: MouseEvent) => {
    maskStyle.value = {
      width: `${Math.abs(e.clientX - startPos.x)}px`,
      height: `${Math.abs(e.clientY - startPos.y)}px`,
      top: `${(e.clientY <= startPos.y ? e.clientY : startPos.y) - startPos.cy}px`,
      left: `${(e.clientX <= startPos.x ? e.clientX : startPos.x) - startPos.cx}px`,
    };
  };
  return {
    blockMousedown,
    contentMousedown,
    is_show_mask,
    maskStyle,
  };
};
