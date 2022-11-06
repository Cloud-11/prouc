import Block from "./src/components/block";
import Render from "./src/Render";
import { Component, userConfig } from "@prouc/core";

interface ComponentCategoryList {
  [key: string]: Component[];
}
function installComponents(componentCategoryList: ComponentCategoryList) {
  Object.keys(componentCategoryList).forEach(category => {
    componentCategoryList[category].forEach(component => {
      userConfig.componentList.set(component.name, component);
    });
  });
}

export { Block, Render, installComponents };
