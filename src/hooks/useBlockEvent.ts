import { computed, h, reactive, ref, Ref, render } from "vue";
import { DATA_JSON, Block } from "..";
import rightMenu from "../components/rightMenu";
import menus from "../utils/menusConfig";
interface LineX {
  showLeft: number;
  activeLeft: number;
}
interface LineY {
  showTop: number;
  activeTop: number;
}
interface Lines {
  x: LineX[];
  y: LineY[];
}
interface BlockStartPos {
  x: number;
  y: number;
  lines?: Lines;
}

export const useBlocsFocus = (data: Ref<DATA_JSON>) => {
  //block选中
  const focusBlocks = computed(() => {
    let focus: Block[] = [];
    let unFocused: Block[] = [];
    data.value.blocks.forEach(block => (block.focus ? focus : unFocused).push(block));
    return { focus, unFocused };
  });

  let blockStartPos: BlockStartPos = {
    x: 0,
    y: 0,
  };

  const blockMousedown = (e: MouseEvent, block: Block, contentRef: Ref) => {
    e.preventDefault();
    e.stopPropagation();
    //非shift清空选择
    if (!e.shiftKey) {
      if (!block.focus) {
        clearFocusBlocks(data, markLine);
      }
    }
    //block被选中
    block.focus = true;

    //block选中添加拖拽事件
    document.addEventListener("mousemove", blockMousemove);
    document.addEventListener("mouseup", blockMouseup);
    //最后一个选中block的位置
    const { unFocused } = focusBlocks.value;

    blockStartPos = {
      x: e.clientX,
      y: e.clientY,
      lines: initLines(focusBlocks, [
        ...unFocused,
        {
          top: 0,
          left: 0,
          width: contentRef.value.clientWidth,
          height: contentRef.value.clientHeight,
        },
      ]),
    };
  };
  //移动所有选中的block 添加吸附辅助线
  let markLine: { x: number | null; y: number | null } = reactive({ x: null, y: null });
  const blockMousemove = (e: MouseEvent) => {
    let { clientX: moveX, clientY: moveY } = e;
    const { focus } = focusBlocks.value;
    const { top: focusTop, left: focusLeft } = focus[focus.length - 1];
    const { x, y, lines } = blockStartPos;
    const newleft = moveX - x + focusLeft;
    const newtop = moveY - y + focusTop;

    //吸附
    markLine.x = null;
    markLine.y = null;

    //show top line
    let minTopIndex = -1;
    (lines as Lines).y.forEach((yline, index) => {
      if (Math.abs(yline.activeTop - newtop) <= 3) {
        minTopIndex = minTopIndex < 0 ? index : Math.min(minTopIndex, index);
      }
    });
    if (minTopIndex >= 0) {
      const { showTop, activeTop } = (lines as Lines).y[minTopIndex];
      moveY = y - focusTop + activeTop;
      markLine.y = showTop;
    }

    //show left line
    let minLeftIndex = -1;
    (lines as Lines).x.forEach((xline, index) => {
      if (Math.abs(xline.activeLeft - newleft) <= 3) {
        minLeftIndex = minLeftIndex < 0 ? index : Math.min(minLeftIndex, index);
      }
    });
    if (minLeftIndex >= 0) {
      const { showLeft, activeLeft } = (lines as Lines).x[minLeftIndex];
      moveX = x - focusLeft + activeLeft;
      markLine.x = showLeft;
    }
    const durx = moveX - x;
    const dury = moveY - y;

    //移动所有选中的block
    focusBlocks.value.focus.forEach(block => {
      block.top += dury;
      block.left += durx;
    });
    //记录鼠标新位置
    blockStartPos.x = moveX;
    blockStartPos.y = moveY;
  };
  const blockMouseup = (e: MouseEvent) => {
    // markLine.x = null;
    // markLine.y = null;
    document.removeEventListener("mousemove", blockMousemove);
    document.removeEventListener("mouseup", blockMouseup);
  };

  return {
    blockMousedown,
    markLine,
  };
};

//清空focus
export const clearFocusBlocks = (
  data: Ref<DATA_JSON>,
  markLine: { x: number | null; y: number | null }
) => {
  markLine.x = null;
  markLine.y = null;
  data.value.blocks.forEach(block => (block.focus = false));
};

//
const initLines = (
  focusBlocks: Ref,
  needLinesArr: { top: number; left: number; width: number; height: number }[]
) => {
  const { focus, unFocused } = focusBlocks.value;
  const { width: focusWidth, height: focusHeight } = focus[focus.length - 1];
  const lines: Lines = { x: [], y: [] };
  needLinesArr.forEach(block => {
    const { top, left, width, height } = block;

    //---横线 依据top值 ---
    //底对顶
    lines.y.push({ showTop: top, activeTop: top - focusHeight });
    //顶对顶
    lines.y.push({ showTop: top, activeTop: top });
    //中对中
    lines.y.push({
      showTop: top + height / 2,
      activeTop: top + height / 2 - focusHeight / 2,
    });
    //底对底
    lines.y.push({
      showTop: top + height,
      activeTop: top + height - focusHeight,
    });
    //顶对底
    lines.y.push({
      showTop: top + height,
      activeTop: top + height,
    });
    //---竖线 依据left值 ---
    //右对左
    lines.x.push({ showLeft: left, activeLeft: left - focusWidth });
    //左对左
    lines.x.push({ showLeft: left, activeLeft: left });
    //中对中
    lines.x.push({
      showLeft: left + width / 2,
      activeLeft: left + width / 2 - focusWidth / 2,
    });
    //右对右
    lines.x.push({
      showLeft: left + width,
      activeLeft: left + width - focusWidth,
    });
    //左对右
    lines.x.push({
      showLeft: left + width,
      activeLeft: left + width,
    });
  });
  return lines;
};

export const useBlockMenu = (e: MouseEvent) => {
  e.preventDefault();
  const vnode = h(rightMenu, {
    items: menus,
    style: { top: e.pageY + "px", left: e.pageX + "px" },
  });
  render(vnode, document.body);
};
