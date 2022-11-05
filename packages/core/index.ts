import { Component } from "./src/component";
import { reactive, UnwrapNestedRefs, VNode } from "vue";

export * from "./src/component";

export interface Category {
  name: string;
  desc: string;
  active: boolean;
  icon: () => VNode;
}

export const userConfig: UnwrapNestedRefs<{
  categoryList: Category[];
  componentList: Map<string, Component>;
  componentCategoryList: Map<string, Component[]>;
}> = reactive({
  //组件配置 右侧
  //组件分类配置 左侧
  categoryList: [],
  //组件列表 按分类
  componentList: new Map<string, Component>(),
  //组件列表 全部
  componentCategoryList: new Map<string, Component[]>(),
});
