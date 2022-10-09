import components, { ComponentsConfig } from "@/utils/editorComponentsConfig";
import { defineStore } from "pinia";

export const useComponentsConfigStore = defineStore("componentsConfigStore", () => {
  const componentsConfig: ComponentsConfig = components;

  return { componentsConfig };
});
