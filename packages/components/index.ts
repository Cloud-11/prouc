import basic from "./src/basic";
import Input from "./src/form/Input";
import container from "./src/container";
import { AnyObject } from "@prouc/shared";
import { Rule, Options } from "@form-create/element-ui";

export interface Component {
  label: string;
  type: string;
  preview: () => JSX.Element;
  render: (props: any, event?: any, solts?: any) => () => JSX.Element;
  setting: {
    form: FormJsonSchema;
    events: AnyObject<ComponentEvent | any>;
    methods: AnyObject<ComponentMethod | any>;
  };
}
export interface ComponentEvent {
  label: string;
  desc: string;
  event: string;
  args: { name: string; type: string }[] | [];
}
export interface ComponentMethod {
  label: string;
  desc: string;
  action: string;
}
export interface FormJsonSchema {
  rule: Rule[];
  options: Options;
  initData: AnyObject;
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

function createEditorConfig() {
  const componentsList = {
    basic,
    form: [Input],
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
