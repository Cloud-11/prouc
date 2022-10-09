import { Delete } from "@element-plus/icons-vue";
const commands = {
  delete: (e: MouseEvent) => {
    console.log(e);
  },
};
export default [
  { label: "删除", icon: () => <Delete />, handler: commands["delete"] },
  { label: "删除", icon: () => <Delete />, handler: commands["delete"] },
  { label: "删除", icon: () => <Delete />, handler: commands["delete"] },
  { label: "删除", icon: () => <Delete />, handler: commands["delete"] },
  { label: "删除", icon: () => <Delete />, handler: commands["delete"] },
  { label: "删除", icon: () => <Delete />, handler: commands["delete"] },
];
