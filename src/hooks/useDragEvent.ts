import { Ref } from "vue";
import { Component } from "../utils/editorComponentsConfig";
import { DATA_JSON } from "./../index.d";

export const useDraggerHandle = (data: Ref<DATA_JSON>, compontentRef: Ref) => {
  let currentComponent: Component | null;
  const dragenter = (e: DragEvent) => {
    //元素检测到拖动进入 设置禁用标识
    (e.dataTransfer as DataTransfer).dropEffect = "move";
  };
  const dragover = (e: DragEvent) => {
    //元素检测到拖动经过 阻止默认事件 drop
    e.preventDefault();
  };
  const dragleave = (e: DragEvent) => {
    //元素检测到拖动离开 设置禁用标识
    (e.dataTransfer as DataTransfer).dropEffect = "none";
  };
  const drop = (e: DragEvent) => {
    //松手 进入
    if (!currentComponent) return;
    const { type } = currentComponent as Component;
    console.dir(e);
    const block = {
      type,
      zIndex: 1,
      top: e.offsetY - (previewTarget as HTMLElement).offsetHeight / 2,
      left: e.offsetX - (previewTarget as HTMLElement).offsetWidth / 2,
    };
    console.log(block);

    data.value.blocks.push(block);
    currentComponent = null;
    previewTarget = null;
  };
  let previewTarget: HTMLElement | null = null;
  return {
    dragStart: (e: DragEvent, component: Component) => {
      currentComponent = component;
      compontentRef.value.addEventListener("dragenter", dragenter);
      compontentRef.value.addEventListener("dragover", dragover);
      compontentRef.value.addEventListener("dragleave", dragleave);
      console.log(e);

      previewTarget = (e.target as HTMLElement).lastChild as HTMLElement;
      compontentRef.value.addEventListener("drop", drop);
    },
    dragEnd: () => {
      currentComponent = null;
      previewTarget = null;
      compontentRef.value.removeEventListener("dragenter", dragenter);
      compontentRef.value.removeEventListener("dragover", dragover);
      compontentRef.value.removeEventListener("dragleave", dragleave);
      compontentRef.value.removeEventListener("drop", drop);
    },
  };
};
