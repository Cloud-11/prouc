import { default as input } from "./elementPlus/input";
import { default as button } from "./elementPlus/button";
import { default as text, ProucText } from "./customComponents/text";
import { ProucComponent } from "@prouc/core";
import "element-plus/dist/index.css";
import { ElInput, ElButton } from "element-plus";

//全局注册ui组件
export const elementUi = {
  install: function (app: any) {
    app.component(ElInput.name, ElInput);
    app.component(ElButton.name, ElButton);
    app.component(ProucText.name, ProucText);
  },
};

export const componentsClassList: { [key: string]: ProucComponent[] } = {
  basic: [button, text],
  form: [input],
};
