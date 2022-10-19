import { Ref } from "vue";
import { Block, Container } from "@/index.d";
import { RecordOpts } from "@/stores/jsonData";
import { cloneDeep } from "lodash";

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

export const useBlocsEvent = (
  container: Ref<Container>,
  focusAndBlocks: Ref<{
    focusBlocks: Block[];
    unFocusBlocks: Block[];
    lastFocusBlock: Block;
  }>,
  clearFocusBlock: () => void,
  modifyBlock: (id: number, attrs: string, block: Block) => void,
  hiddenRightMenu: () => void,
  recordOpts: (opera: RecordOpts, tag?: string | undefined) => void,
  markLine: Ref<{ x: number | null; y: number | null }>,
  contentRef: Ref<HTMLElement>
) => {
  let blockStartPos: BlockStartPos = {
    x: 0,
    y: 0,
  };
  let isMove = false;
  const blockMousedown = (e: MouseEvent, block: Block) => {
    e.preventDefault();
    e.stopPropagation();
    //隐藏右键菜单
    hiddenRightMenu();
    //非shift清空选择
    if (!e.shiftKey) {
      if (!block.status.focus) {
        clearFocusBlocks(clearFocusBlock, markLine);
      }
    }
    //block被选中
    const b = cloneDeep(block);
    b.status.focus = true;
    modifyBlock(b.id, "status.focus", b);

    //block选中添加拖拽事件
    document.addEventListener("mousemove", blockMousemove);
    document.addEventListener("mouseup", blockMouseup);

    blockStartPos = {
      x: e.clientX,
      y: e.clientY,
      lines: initLines(focusAndBlocks.value.lastFocusBlock, [
        ...focusAndBlocks.value.unFocusBlocks,
        {
          attr: {
            offsetY: 0,
            offsetX: 0,
            width: contentRef.value.clientWidth,
            height: contentRef.value.clientHeight,
          },
        },
      ]),
    };
    //将要移动先记录 未移动再删除
    recordOpts(RecordOpts.MOVE);
  };
  //移动所有选中的block 添加吸附辅助线
  const blockMousemove = (e: MouseEvent) => {
    let { clientX: moveX, clientY: moveY } = e;

    const { offsetY: focusTop, offsetX: focusLeft } =
      focusAndBlocks.value.lastFocusBlock.attr;
    const { x, y, lines } = blockStartPos;
    const { scale } = container.value;
    const newleft = moveX - x + focusLeft;
    const newtop = moveY - y + focusTop;

    //吸附
    markLine.value.x = null;
    markLine.value.y = null;

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
      markLine.value.y = showTop;
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
      markLine.value.x = showLeft;
    }
    //处理缩放问题
    const durx = (moveX - x) / scale;
    const dury = (moveY - y) / scale;

    if (durx != 0 || dury != 0) {
      isMove = true;
      //移动所有选中的block
      focusAndBlocks.value.focusBlocks.forEach(block => {
        block.attr.offsetY += dury;
        block.attr.offsetX += durx;
      });
    }

    //记录鼠标新位置
    blockStartPos.x = moveX;
    blockStartPos.y = moveY;
  };
  const blockMouseup = () => {
    if (!isMove) {
      recordOpts(RecordOpts.MOVE, "unmove");
    } else {
      isMove = false;
    }
    document.removeEventListener("mousemove", blockMousemove);
    document.removeEventListener("mouseup", blockMouseup);
  };

  return {
    blockMousedown,
  };
};

//清空focus
export const clearFocusBlocks = (
  clearFocusBlock: Function,
  markLine: Ref<{ x: number | null; y: number | null }>
) => {
  markLine.value.x = null;
  markLine.value.y = null;
  clearFocusBlock();
};

//
const initLines = (
  lastFocusBlock: Block,
  needLinesArr: {
    attr: { offsetY: number; offsetX: number; width: number; height: number };
  }[]
) => {
  const {
    attr: { width: focusWidth, height: focusHeight },
  } = lastFocusBlock;
  const lines: Lines = { x: [], y: [] };
  needLinesArr.forEach(block => {
    const {
      attr: { offsetY: top, offsetX: left, width, height },
    } = block;

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
