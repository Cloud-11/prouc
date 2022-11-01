import "@icon-park/vue-next/styles/index.css";
import "element-plus/dist/index.css";
import Home from "@/pages/home.vue";
import Preview from "@/pages/preview.vue";
import { setPreviewMode, PreviewModeOption } from "@/utils";
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElTabs,
  ElTabPane,
  ElInputNumber,
  ElCascader,
  ElOption,
  ElSelect,
  ElIcon,
  ElSlider,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElScrollbar,
  ElSwitch,
  ElRow,
  ElCol,
} from "element-plus";
import FormCreate from "@form-create/element-ui";
import { App } from "vue";

const PreviewMode = (options: PreviewModeOption) => {
  setPreviewMode(options);
};
export { Home, Preview, PreviewMode };

const importComponents = [
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElTabs,
  ElTabPane,
  ElInputNumber,
  ElCascader,
  ElOption,
  ElSelect,
  ElIcon,
  ElSlider,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElScrollbar,
  ElSwitch,
  ElRow,
  ElCol,
];

export default {
  install: (app: App): void => {
    for (const comp of importComponents) {
      app.component(comp.name, comp);
    }
    app.use(FormCreate);
  },
};
