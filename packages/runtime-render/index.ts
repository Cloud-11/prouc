import Block from "./src/components/block";
import Render from "./src/Render";
import { Component, userConfig } from "@prouc/core";

function installComponents(componentList: Map<string, Component>) {
  userConfig.componentList = componentList;
}

export { Block, Render, installComponents };
