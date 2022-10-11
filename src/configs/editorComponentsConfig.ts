import editorComponentsList from "./editorComponents";

export interface Component {
  label: string;
  type: string;
  preview: () => any;
  render: () => any;
}

export interface ComponentsConfig {
  componentList: Component[];
  componentMap: { [key: string]: Component };
  register: (component: Component) => void;
}

function createEditorConfig(): ComponentsConfig {
  const componentList: Component[] = [];
  const componentMap: ComponentsConfig["componentMap"] = {};
  return {
    componentList,
    componentMap,
    register: (component: Component) => {
      componentList.push(component);
      componentMap[component.type] = component;
    },
  };
}
const componentsConfig = createEditorConfig();

//注册组件
editorComponentsList.forEach(component => {
  componentsConfig.register(component);
});

export default componentsConfig;
