import { ProucComponent, userConfig } from "@prouc/core";
export { default as Block } from "./src/components/block";
export { default as Render } from "./src/Render";

interface ComponentCategoryList {
  [key: string]: ProucComponent[];
}
function installComponents(componentCategoryList: ComponentCategoryList) {
  Object.keys(componentCategoryList).forEach(category => {
    componentCategoryList[category].forEach(component => {
      userConfig.componentList.set(component.name, component);
    });
  });
}

export { installComponents };
