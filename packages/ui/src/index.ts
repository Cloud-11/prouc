import { default as input } from "./elementPlus/input";
import { default as button } from "./elementPlus/button";
import { Component } from "@prouc/core";

export const componentsClassList: { [key: string]: Component[] } = {
  basic: [button],
  form: [input],
};
