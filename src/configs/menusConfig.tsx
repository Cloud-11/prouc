export interface RightMenu {
  label: string;
  icon: () => void;
  handler: (e: MouseEvent) => void;
}
export interface RightMenuOpts {
  groupOpts?: RightMenu[];
  copyOpts?: RightMenu[];
  moveOpts?: RightMenu[];
  otherOpts?: RightMenu[];
}
const operation = () => {};
const commands = {
  group: (e: MouseEvent) => {
    console.log(e);
  },
  ungroup: (e: MouseEvent) => {
    console.log(e);
  },
  copy: (e: MouseEvent) => {
    console.log(e);
  },
  paste: (e: MouseEvent) => {
    console.log(e);
  },
  toTop: (e: MouseEvent) => {
    console.log(e);
  },
  toBottom: (e: MouseEvent) => {
    console.log(e);
  },
  up: (e: MouseEvent) => {
    console.log(e);
  },
  down: (e: MouseEvent) => {
    console.log(e);
  },
  undo: (e: MouseEvent) => {
    console.log(e);
  },
  delete: (e: MouseEvent) => {
    console.log(e);
  },
};

const groupOpts: RightMenu[] = [
  {
    label: "组合",
    icon: () => <group theme="outline" size="24" fill="#333" />,
    handler: commands["group"],
  },
  {
    label: "取消组合",
    icon: () => <ungroup theme="outline" size="24" fill="#333" />,
    handler: commands["ungroup"],
  },
];

const copyOpts: RightMenu[] = [
  {
    label: "复制",
    icon: () => <copy theme="outline" size="24" fill="#333" />,
    handler: commands["copy"],
  },
  {
    label: "粘贴",
    icon: () => <clipboard theme="outline" size="24" fill="#333" />,
    handler: commands["paste"],
  },
];

const moveOpts: RightMenu[] = [
  {
    label: "置顶",
    icon: () => <to-top-one theme="outline" size="24" fill="#333" />,
    handler: commands["toTop"],
  },
  {
    label: "置底",
    icon: () => <to-bottom-one theme="outline" size="24" fill="#333" />,
    handler: commands["toBottom"],
  },
  {
    label: "上移",
    icon: () => <up theme="outline" size="24" fill="#333" />,
    handler: commands["up"],
  },
  {
    label: "下移",
    icon: () => <down theme="outline" size="24" fill="#333" />,
    handler: commands["down"],
  },
];
const otherOpts: RightMenu[] = [
  {
    label: "撤销",
    icon: () => <back theme="outline" size="24" fill="#333" />,
    handler: commands["undo"],
  },
  {
    label: "删除",
    icon: () => <delete theme="outline" size="24" fill="#333" />,
    handler: commands["delete"],
  },
];
export default {
  groupOpts,
  copyOpts,
  moveOpts,
  otherOpts,
};
