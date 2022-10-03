import { Ref } from "vue";
import { Compontent } from "../utils/editorCompontentsConfig";
import { DATA_JSON } from "./../index.d";

let currentCompontent: Compontent | null;
export const useDragstartHandle =
  (drop: (width: number, height: number) => void, compontentRef: Ref) =>
  (e: DragEvent, component: Compontent) => {
    currentCompontent = component;
    compontentRef.value.addEventListener("dragenter", dragenter);
    compontentRef.value.addEventListener("dragover", dragover);
    compontentRef.value.addEventListener("dragleave", dragleave);
    const { offsetWidth, offsetHeight } = (e.target as HTMLElement)
      .lastChild as HTMLElement;
    compontentRef.value.addEventListener("drop", drop(offsetWidth, offsetHeight));
  };

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
export const useDrop =
  (data: Ref<DATA_JSON>) => (width: number, height: number) => (e: DragEvent) => {
    //松手 进入
    if (!currentCompontent) return;
    const { type } = currentCompontent as Compontent;
    data.value.blocks.push({
      type,
      zIndex: 1,
      top: e.offsetY - height / 2,
      left: e.offsetX - width / 2,
    });
    currentCompontent = null;
  };
