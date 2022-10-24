import basic from "./basic";
import form from "./form";
import container from "./container";
import { AnyObject } from "@/index.d";

export interface Component {
  label: string;
  type: string;
  preview: () => JSX.Element;
  render: (data: any) => () => JSX.Element;
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
// export interface ComponentsConfig {
//   componentList: { basic: Component[]; form: Component[]; container: Component[] };
//   componentMap: { [key: string]: Component };
// }

function createEditorConfig() {
  const componentsList = {
    basic,
    form,
    container,
  };
  const componentMap: { [key: string]: Component } = {};
  for (const key in componentsList) {
    componentsList[key as "basic" | "form" | "container"].forEach(component => {
      componentMap[component.type] = component;
    });
  }

  return {
    componentsList,
    componentMap,
  };
}
const componentsConfig = createEditorConfig();

//注册组件

export default componentsConfig;
