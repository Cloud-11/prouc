export * from "./src/component";
import { ProucComponent } from "./src/component";
import { reactive, UnwrapNestedRefs, VNode, watch } from "vue";

export interface Category {
  name: string;
  desc: string;
  active: boolean;
  icon: () => VNode;
}
export const userConfig: UnwrapNestedRefs<{
  categoryList: Category[];
  componentList: Map<string, ProucComponent>;
  componentCategoryList: Map<string, ProucComponent[]>;
}> = reactive({
  //组件配置 右侧
  //组件分类配置 左侧
  categoryList: [],
  //组件列表 按分类
  componentList: new Map<string, ProucComponent>(),
  //组件列表 全部
  componentCategoryList: new Map<string, ProucComponent[]>(),
});
//全局数据源 供绑定
export const globalData = reactive<Record<string, any>>({ default: "default" });
//组件数据
// {
//   "el-input#10010":{
//     text:""
//   }
// }
export const componentsData = reactive<Map<string, any>>(new Map());

interface DataOptions {
  label: string;
  value: string;
  children?: DataOptions[];
}

export const AllDataOptions = reactive<DataOptions[]>([
  {
    label: "全局数据",
    value: "global",
    children: [
      {
        label: "store",
        value: "store",
      },
    ],
  },
  {
    label: "组件数据",
    value: "component",
    children: [
      {
        label: "默认组件数据(无用)",
        value: "store",
      },
    ],
  },
]);
export class EventCenter {
  constructor() {}
}

watch(globalData, () => {
  AllDataOptions[0].children = [];
  Object.keys(globalData).forEach(key => {
    AllDataOptions[0].children?.push({
      label: key,
      value: key,
    });
  });
});
watch(
  () => componentsData.keys(),
  () => {
    console.log(componentsData);
    AllDataOptions[1].children = [];
    componentsData.forEach((val, id) => {
      const ids = id.split("#");
      const componentName = userConfig.componentList.get(ids[0])?.label;
      AllDataOptions[1].children?.push({
        label: `${componentName}#${ids[1]}`,
        value: id,
        children: Object.keys(val).map(key => ({
          label: key,
          value: key,
        })),
      });
    });
  }
);
