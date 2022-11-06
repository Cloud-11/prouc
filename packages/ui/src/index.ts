import { default as input } from "./elementPlus/input";
import { default as button } from "./elementPlus/button";
import { Component } from "@prouc/core";
import "element-plus/dist/index.css";
import { ElInput, ElButton } from "element-plus";

//全局注册ui组件
export const elementUi = {
  install: function (app: any) {
    app.component(ElInput.name, ElInput);
    app.component(ElButton.name, ElButton);
  },
};

export const componentsClassList: { [key: string]: Component[] } = {
  basic: [button],
  form: [input],
};
