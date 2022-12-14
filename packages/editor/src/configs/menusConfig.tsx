import { Block, Container, Group } from "@prouc/shared";
import { isNumber, cloneDeep } from "lodash";
import { Ref } from "vue";
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
  containerRef: Ref<HTMLElement>,
  contentRef: Ref<HTMLElement>,
  container: Ref<Container>,
  clipboard: Ref<Block[]>,
  copyMousePos: Ref<{ x: number; y: number; copyScale: number; copyNum: number }>
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
        top = count == 0 ? block.attr.offsetY : Math.min(top, block.attr.offsetY - 1);
        left = count == 0 ? block.attr.offsetX : Math.min(left, block.attr.offsetX - 1);
        count++;
        blocks.push(block);
      });
      blocks.forEach(block => {
        block.group = true;
        block.status.focus = false;
        width = Math.max(width, block.attr.offsetX + block.attr.width - left + 3);
        height = Math.max(height, block.attr.offsetY + block.attr.height - top + 1);
        block.attr.offsetX -= left;
        block.attr.offsetY -= top;
      });

      addBlock(
        {
          type: "group",
          group: false,
          attr: { x: 0, y: 0, offsetY: top, offsetX: left, width, height, zIndex: 1 },
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
        block.attr.offsetY += group.attr.offsetY + 1;
        block.attr.offsetX += group.attr.offsetX + 1;
        addBlock(block, "ungroup");
      });
      removeBlock(group.id, "ungroup");
    },
    copy: (e: MouseEvent) => {
      let x = 0,
        y = 0;
      clipboard.value = [];
      focusAndBlocks.value.focusBlocks.forEach(block => {
        const b = cloneDeep(block);
        clipboard.value.push(b);
        if (x == 0) {
          x = b.attr.x;
          y = b.attr.y;
        }
      });
      const { scale } = container.value;
      copyMousePos.value = { x, y, copyScale: scale, copyNum: 0 };
    },
    paste: (e: MouseEvent) => {
      if (clipboard.value.length == 0) return;
      const { clientX, clientY } = e;
      const { scale } = container.value;
      clearFocusBlock();

      let { x, y, copyScale } = copyMousePos.value;

      clipboard.value.forEach((b, index) => {
        let dury = 0,
          durx = 0;
        if (clientX) {
          //?????????????????????????????????????????????????????????????????????client??????
          if (copyScale !== scale) {
            const containerBox = containerRef.value.offsetParent as HTMLElement;
            const containerX = containerBox.offsetLeft + contentRef.value.offsetLeft;
            const containerY = containerBox.offsetTop + contentRef.value.offsetTop;
            const {
              width: cw,
              height: ch,
              scale,
              offsetX: cx,
              offsetY: cy,
            } = container.value;
            const cwS = (cw * (1 - scale)) / 2;
            const chS = (ch * (1 - scale)) / 2;
            const { offsetX: ox, offsetY: oy } = clipboard.value[0].attr;
            x = containerX + cwS + ox * scale + cx;
            y = containerY + chS + oy * scale + cy;
          }
          //????????????????????? ????????????????????????
          durx = (clientX - x) / scale;
          dury = (clientY - y) / scale;
        } else {
          durx = dury = ++copyMousePos.value.copyNum * 20;
        }
        //?????????????????? ????????????????????????????????????
        const block = cloneDeep(b);
        block.attr.offsetX += durx;
        block.attr.offsetY += dury;
        block.status.focus = true;
        addBlock(block, index == clipboard.value.length - 1 ? "copyOver" : "copy");
      });
    },
    toTop: () => {
      const { unFocusBlocks } = focusAndBlocks.value;
      const maxzIndex = unFocusBlocks.reduce((prev: number, block: Block) => {
        return Math.max(prev, block.attr.zIndex);
      }, -Infinity);
      set_zIndex(maxzIndex + 1);
    },
    toBottom: () => {
      const { unFocusBlocks } = focusAndBlocks.value;
      const minzIndex = unFocusBlocks.reduce((prev: number, block: Block) => {
        return Math.min(prev, block.attr.zIndex);
      }, Infinity);
      set_zIndex(minzIndex - 1);
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
    label: "??????",
    name: "group",

    icon: () => <group theme="outline" size="24" fill="#333" />,
  },
  {
    label: "????????????",
    name: "ungroup",
    icon: () => <ungroup theme="outline" size="24" fill="#333" />,
  },
];

const copyOpts: RightMenu[] = [
  {
    label: "??????",
    name: "copy",
    keyboard: ["ctrl+c"],
    icon: () => <copy theme="outline" size="24" fill="#333" />,
  },
  {
    label: "??????",
    name: "paste",
    keyboard: ["ctrl+v"],
    icon: () => <clipboard theme="outline" size="24" fill="#333" />,
  },
];

const moveOpts: RightMenu[] = [
  {
    label: "??????",
    name: "toTop",
    icon: () => <to-top-one theme="outline" size="24" fill="#333" />,
  },
  {
    label: "??????",
    name: "toBottom",
    icon: () => <to-bottom-one theme="outline" size="24" fill="#333" />,
  },
  {
    label: "??????",
    name: "up",
    icon: () => <up theme="outline" size="24" fill="#333" />,
  },
  {
    label: "??????",
    name: "down",
    icon: () => <down theme="outline" size="24" fill="#333" />,
  },
];
const otherOpts: RightMenu[] = [
  {
    label: "??????",
    name: "undo",
    keyboard: ["ctrl+z"],
    icon: () => <back theme="outline" size="24" fill="#333" />,
  },
  {
    label: "??????",
    name: "delete",
    keyboard: ["Delete"],
    icon: () => <delete theme="outline" size="24" fill="#333" />,
  },
];
export default {
  groupOpts,
  copyOpts,
  moveOpts,
  otherOpts,
};
