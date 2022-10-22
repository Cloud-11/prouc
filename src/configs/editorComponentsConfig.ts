import { VNode } from "vue";
import { AnyObject } from "..";
import editorComponentsList from "./editorComponents";

export interface Component {
  label: string;
  type: string;
  preview: () => JSX.Element;
  render: (data: any) => () => VNode;
  setting: {
    form: JsonSchemaForm;
  };
}

export interface JsonSchemaForm {
  schema: JsonSchema;
  uiSchema: AnyObject;
  formFooter: AnyObject;
  formProps: AnyObject;
}
export interface JsonSchema {
  type: string;
  required: any[];
  properties: propsObj;
  "ui:order": string[];
}
interface propsObj {
  [key: string]: Properties | any;
}
interface Properties {
  title: string;
  type: string;
  "ui:widget": string;
  default: string;
  enum?: any[];
  enumNames?: any[];
  "ui:options"?: AnyObject;
  multipleOf?: number;
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
