import { Ref } from "vue";
import { ProucComponent } from "@prouc/core";
import { Block } from "@prouc/shared";

export const useDraggerHandle = (
  addBlock: (block: Block, tag?: string) => void,
  contentRef: Ref<HTMLElement>
) => {
  let currentComponent: ProucComponent | null;
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
    const { name } = currentComponent as ProucComponent;
    const block = {
      id: 0,
      type: name,
      group: false,
      status: { focus: false, lock: false },
      attr: {
        x: 0,
        y: 0,
        zIndex: 1,
        offsetY: e.offsetY,
        offsetX: e.offsetX,
        width: 0,
        height: 0,
      },
      propsData: {},
      events: [],
    };
    addBlock(block);
    currentComponent = null;
  };

  return {
    dragStart: (component: ProucComponent) => {
      currentComponent = component;
      contentRef.value.addEventListener("dragenter", dragenter);
      contentRef.value.addEventListener("dragover", dragover);
      contentRef.value.addEventListener("dragleave", dragleave);
      contentRef.value.addEventListener("drop", drop);
    },
    dragEnd: () => {
      currentComponent = null;
      contentRef.value.removeEventListener("dragenter", dragenter);
      contentRef.value.removeEventListener("dragover", dragover);
      contentRef.value.removeEventListener("dragleave", dragleave);
      contentRef.value.removeEventListener("drop", drop);
    },
  };
};
