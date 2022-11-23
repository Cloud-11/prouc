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
  ElTree,
} from "element-plus";
import FormCreate from "@form-create/element-ui";
import { App } from "vue";
import { Category, ProucComponent, userConfig } from "@prouc/core";

const PreviewMode = (options: PreviewModeOption) => {
  setPreviewMode(options);
};

const importComponents = [
  // ElButton,
  // ElInput,
  ElTree,
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

export interface ComponentCategoryList {
  [key: string]: ProucComponent[];
}
function installComponents(componentCategoryList: ComponentCategoryList) {
  Object.keys(componentCategoryList).forEach(category => {
    let categoryComponents: ProucComponent[] = [];
    componentCategoryList[category].forEach(component => {
      categoryComponents.push(component);
      userConfig.componentList.set(component.name, component);
    });
    userConfig.componentCategoryList.set(category, categoryComponents);
  });
}

function createProucEditor(
  componentsClassList: ComponentCategoryList,
  categoryList: Category[]
) {
  installComponents(componentsClassList);
  userConfig.categoryList = categoryList;
  return {
    install: (app: App): void => {
      for (const comp of importComponents) {
        app.component(comp.name, comp);
        // comp.
      }
      app.use(FormCreate);
    },
  };
}

export { Home, Preview, PreviewMode, createProucEditor };
