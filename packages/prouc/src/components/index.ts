import { h } from "vue";
import { AllApplication, TableFile, Box, Play } from "@icon-park/vue-next";
import { createProucEditor } from "@prouc/editor";
import { componentsClassList } from "@prouc/ui";

const categoryList = [
  {
    name: "basic",
    desc: "基础组件",
    active: true,
    icon: () =>
      h(AllApplication, {
        theme: "outline",
        size: "16",
        fill: "#1890ff",
      }),
  },
  {
    name: "form",
    desc: "表单组件",
    active: false,
    icon: () =>
      h(TableFile, {
        theme: "outline",
        size: "24",
        fill: "#1890ff",
      }),
  },
  {
    name: "container",
    desc: "容器组件",
    active: false,
    icon: () => h(Box, { theme: "outline", size: "24", fill: "#1890ff" }),
  },
  {
    name: "media",
    desc: "媒体组件",
    active: false,
    icon: () => h(Play, { theme: "outline", size: "24", fill: "#1890ff" }),
  },
];

export const proucEditor = createProucEditor(componentsClassList, categoryList);
