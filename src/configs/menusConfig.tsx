import { isNumber, cloneDeep } from "lodash";
import { Ref, toRaw } from "vue";
import { Group, Block } from "./../index.d";
export interface RightMenu {
  label: string;
  name: CommandName;
  keyboard?: string[];
  icon: () => void;
}
export interface RightMenuOpts {
  groupOpts?: RightMenu[];
  copyOpts?: RightMenu[];
  moveOpts?: RightMenu[];
  otherOpts?: RightMenu[];
}
export type CommandName =
  | "group"
  | "ungroup"
  | "copy"
  | "paste"
  | "toTop"
  | "toBottom"
  | "up"
  | "down"
  | "undo"
  | "delete";

export type Commands = {
  [key in CommandName]: Function;
};

export const useRightMenuHandler = (
  focusAndBlocks: Ref<{
    focusBlocks: Block[];
    unFocusBlocks: Block[];
    lastFocusBlock: Block;
  }>,
  removeBlock: Function,
  addBlock: Function,
  modifyBlock: Function,
  clearFocusBlock: Function,
  undoRecordOpts: Function,
  contentRef: Ref<HTMLElement>,
  clipboard: Ref<Block[]>,
  copyMousePos: Ref<{ x: number; y: number; copyNum: number }>
): Commands => {
  const commands = {
    group: () => {
      let top = 0,
        left = 0,
        width = 0,
        height = 0,
        blocks: Block[] = [],
        count = 0;

      focusAndBlocks.value.focusBlocks.forEach(b => {
        const block = cloneDeep(b);
        removeBlock(b.id, "group");
        top = count == 0 ? block.attr.offsetY : Math.min(top, block.attr.offsetY);
        left = count == 0 ? block.attr.offsetX : Math.min(left, block.attr.offsetX);
        count++;
        blocks.push(block);
      });
      blocks.forEach(block => {
        block.group = true;
        block.status.focus = false;
        width = Math.max(width, block.attr.offsetX + block.attr.width - left);
        height = Math.max(height, block.attr.offsetY + block.attr.height - top);
        block.attr.offsetY -= top;
        block.attr.offsetX -= left;
      });

      addBlock(
        {
          type: "group",
          group: false,
          attr: { top, left, width, height, zIndex: 1 },
          status: { focus: true, lock: false },
          blocks,
        },
        "group"
      );
    },
    ungroup: () => {
      const group = focusAndBlocks.value.focusBlocks[0] as Group;
      group.blocks.forEach(b => {
        const block = cloneDeep(b);
        block.group = false;
        block.attr.offsetY += group.attr.offsetY;
        block.attr.offsetX += group.attr.offsetX;
        addBlock(block, "ungroup");
      });
      removeBlock(group.id, "ungroup");
    },
    copy: (e: MouseEvent) => {
      console.log("copy", focusAndBlocks);
      const { offsetTop, offsetLeft } = contentRef.value;
      const { focusBlocks } = toRaw(focusAndBlocks.value);
      let { clientX: x, clientY: y } = e;
      clipboard.value = [];
      focusBlocks.forEach(block => {
        const b = cloneDeep(block);
        clipboard.value.push(b);
        if (x == undefined) {
          x = b.attr.offsetX + offsetLeft;
          y = b.attr.offsetY + offsetTop;
        }
      });
      copyMousePos.value = { x, y, copyNum: 0 };
    },
    paste: (e: MouseEvent) => {
      console.log("paste");
      const { offsetTop, offsetLeft } = contentRef.value;
      if (clipboard.value.length == 0) return;
      const { clientX, clientY } = e;

      let mousePosX = 0,
        mousePosY = 0,
        copyMousePosY = 0,
        copyMousePosX = 0;

      if (copyMousePos.value.x && clientX) {
        //当前鼠标位置 依据content重新定位
        mousePosX = clientX - offsetLeft;
        mousePosY = clientY - offsetTop;
        //拷贝时鼠标位置 依据content重新定位
        copyMousePosY = copyMousePos.value.y - offsetTop;
        copyMousePosX = copyMousePos.value.x - offsetLeft;
      }
      clearFocusBlock();
      clipboard.value.forEach((b, index) => {
        let top = 0,
          left = 0;
        if (copyMousePos.value.x && clientX) {
          //拷贝时鼠标位置 和各组件相对差值
          left = mousePosX - (copyMousePosX - b.attr.offsetX);
          top = mousePosY - (copyMousePosY - b.attr.offsetY);
        } else {
          copyMousePos.value.copyNum++;
          top = b.attr.offsetY + copyMousePos.value.copyNum * 20;
          left = b.attr.offsetX + copyMousePos.value.copyNum * 20;
        }
        //当前鼠标位置 加差值复原各组件相对位置
        const block = cloneDeep(b);
        block.attr.offsetX = left;
        block.attr.offsetY = top;
        block.status.focus = true;
        addBlock(block, index == clipboard.value.length - 1 ? "copyOver" : "copy");
      });
    },
    toTop: () => {
      set_zIndex(999);
    },
    toBottom: () => {
      set_zIndex(1);
    },
    up: () => {
      set_zIndex("+");
    },
    down: () => {
      set_zIndex("-");
    },
    undo: () => {
      undoRecordOpts();
    },
    delete: () => {
      const { focusBlocks } = focusAndBlocks.value;
      focusBlocks.forEach(b => {
        removeBlock(b.id);
      });
    },
  };
  const set_zIndex = (zIndex: number | string) => {
    focusAndBlocks.value.focusBlocks.forEach(b => {
      const block = cloneDeep(b);
      if (isNumber(zIndex)) {
        block.attr.zIndex = zIndex;
      } else {
        if (zIndex === "+") {
          block.attr.zIndex++;
        } else {
          block.attr.zIndex--;
        }
      }

      modifyBlock(b.id, "attr.zIndex", block);
    });
  };
  return commands;
};

const groupOpts: RightMenu[] = [
  {
    label: "组合",
    name: "group",

    icon: () => <group theme="outline" size="24" fill="#333" />,
  },
  {
    label: "取消组合",
    name: "ungroup",
    icon: () => <ungroup theme="outline" size="24" fill="#333" />,
  },
];

const copyOpts: RightMenu[] = [
  {
    label: "复制",
    name: "copy",
    keyboard: ["ctrl+c"],
    icon: () => <copy theme="outline" size="24" fill="#333" />,
  },
  {
    label: "粘贴",
    name: "paste",
    keyboard: ["ctrl+v"],
    icon: () => <clipboard theme="outline" size="24" fill="#333" />,
  },
];

const moveOpts: RightMenu[] = [
  {
    label: "置顶",
    name: "toTop",
    icon: () => <to-top-one theme="outline" size="24" fill="#333" />,
  },
  {
    label: "置底",
    name: "toBottom",
    icon: () => <to-bottom-one theme="outline" size="24" fill="#333" />,
  },
  {
    label: "上移",
    name: "up",
    icon: () => <up theme="outline" size="24" fill="#333" />,
  },
  {
    label: "下移",
    name: "down",
    icon: () => <down theme="outline" size="24" fill="#333" />,
  },
];
const otherOpts: RightMenu[] = [
  {
    label: "撤销",
    name: "undo",
    keyboard: ["ctrl+z"],
    icon: () => <back theme="outline" size="24" fill="#333" />,
  },
  {
    label: "删除",
    name: "delete",
    keyboard: ["Delete", "Backspace"],
    icon: () => <delete theme="outline" size="24" fill="#333" />,
  },
];
export default {
  groupOpts,
  copyOpts,
  moveOpts,
  otherOpts,
};
