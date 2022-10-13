import { Ref, toRaw } from "vue";
import { Block } from "..";
import { Group } from "./../index.d";
export interface RightMenu {
  label: string;
  name: CommandName;
  icon: () => void;
}
export interface RightMenuOpts {
  groupOpts?: RightMenu[];
  copyOpts?: RightMenu[];
  moveOpts?: RightMenu[];
  otherOpts?: RightMenu[];
}
type CommandName =
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
const operation = () => {};

export const useRightMenuHandler = (
  command: CommandName,
  focusAndBlocks: Ref<{
    focusBlocks: Block[];
    unFocusBlocks: Block[];
    lastFocusBlock: Block;
  }>,
  removeBlock: Function,
  addBlock: Function,
  modifyBlock: Function,
  contentRef: Ref<HTMLElement>,
  clipboard: Ref<Block[]>,
  copyMousePos: Ref<{ x: number; y: number }>
): Function => {
  const focusAndBlocksRaw = toRaw(focusAndBlocks.value);
  const { focusBlocks } = focusAndBlocksRaw;

  const commands = {
    group: () => {
      let top = 0,
        left = 0,
        width = 0,
        height = 0,
        blocks: Block[] = [],
        count = 0;

      focusBlocks.forEach(b => {
        const block = toRaw(b);
        removeBlock(b.id);
        top = count == 0 ? block.top : Math.min(top, block.top);
        left = count == 0 ? block.left : Math.min(left, block.left);
        count++;
        blocks.push(b);
      });
      blocks.forEach(block => {
        block.group = true;
        block.focus = false;
        width = Math.max(width, block.left + block.width - left);
        height = Math.max(height, block.top + block.height - top);
        block.top = block.top - top;
        block.left = block.left - left;
      });

      addBlock({
        type: "group",
        group: false,
        top,
        left,
        width,
        height,
        focus: true,
        blocks,
        zIndex: 1,
      });
    },
    ungroup: () => {
      const group = focusBlocks[0] as Group;
      group.blocks.forEach(b => {
        const block = toRaw(b);
        block.group = false;
        block.top = group.top + block.top + block.height / 2;
        block.left = group.left + block.left + block.width / 2;
        addBlock(block);
      });
      removeBlock(group.id);
    },
    copy: (e: MouseEvent) => {
      clipboard.value = [...focusBlocks];
      copyMousePos.value = { x: e.clientX, y: e.clientY };
    },
    paste: (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { offsetTop, offsetLeft } = contentRef.value;
      console.log(clipboard);
      //当前鼠标位置 依据content重新定位
      const mousePosX = clientX - offsetLeft;
      const mousePosY = clientY - offsetTop;
      //拷贝时鼠标位置 依据content重新定位
      const copyMousePosY = copyMousePos.value.y - offsetTop;
      const copyMousePosX = copyMousePos.value.x - offsetLeft;
      clipboard.value.forEach(b => {
        //拷贝时鼠标位置 和各组件相对差值
        const drux = copyMousePosX - b.left - b.width * 0.5;
        const druy = copyMousePosY - b.top - b.height * 0.5;
        //当前鼠标位置 加差值复原各组件相对位置
        addBlock({
          ...b,
          top: mousePosY - druy,
          left: mousePosX - drux,
        });
      });
    },
    toTop: () => {
      focusAndBlocksRaw.focusBlocks.forEach(b => {
        const block = toRaw(b);
        modifyBlock(block.id, "zIndex", 999);
      });
    },
    toBottom: () => {
      focusAndBlocksRaw.focusBlocks.forEach(b => {
        const block = toRaw(b);
        modifyBlock(block.id, "zIndex", 1);
      });
    },
    up: () => {
      focusAndBlocksRaw.focusBlocks.forEach(b => {
        const block = toRaw(b);
        modifyBlock(block.id, "zIndex", block.zIndex + 1);
      });
    },
    down: () => {
      focusAndBlocksRaw.focusBlocks.forEach(b => {
        const block = toRaw(b);
        modifyBlock(block.id, "zIndex", block.zIndex - 1);
      });
    },
    undo: () => {},
    delete: () => {
      const { focusBlocks } = focusAndBlocks.value;
      focusBlocks.forEach(b => {
        removeBlock(b.id);
      });
    },
  };
  return commands[command];
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
    icon: () => <copy theme="outline" size="24" fill="#333" />,
  },
  {
    label: "粘贴",
    name: "paste",
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
    icon: () => <back theme="outline" size="24" fill="#333" />,
  },
  {
    label: "删除",
    name: "delete",
    icon: () => <delete theme="outline" size="24" fill="#333" />,
  },
];
export default {
  groupOpts,
  copyOpts,
  moveOpts,
  otherOpts,
};
