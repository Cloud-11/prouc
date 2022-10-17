import { ref, Ref } from "vue";
import useMultMask from "./useMultMask";
import { clearFocusBlocks } from "./useBlockEvent";
import { Container, MaskArea } from "..";
export const useContainerEvent = (
  containerRef: Ref<HTMLElement>,
  multipleBlock: (maskArea: Ref<MaskArea>) => void,
  clearFocusBlock: () => void,
  markLine: Ref,
  container: Ref<Container>
) => {
  const { initMaskPos, maskMove, resetMask, isShowSelectMask, maskArea } = useMultMask(
    multipleBlock,
    container
  );

  const containerMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    clearFocusBlocks(clearFocusBlock, markLine);
    initMaskPos(e);
    containerRef.value.addEventListener("mousemove", containerMouseMove);
    window.addEventListener("mouseup", containerMouseUp);
  };
  const containerMouseMove = (e: MouseEvent) => {
    maskMove(e);
  };
  const containerMouseUp = () => {
    resetMask();
    containerRef.value.removeEventListener("mousemove", containerMouseMove);
    window.removeEventListener("mouseup", containerMouseUp);
  };

  return {
    containerMouseDown,

    isShowSelectMask,
    maskArea,
  };
};

export const useContainerFuncKey = () => {
  const isShowContainerMask = ref(false);
  const containerFuncKeyDown = (e: KeyboardEvent) => {
    const { ctrlKey, shiftKey, altKey, key } = e;
    if (ctrlKey && !shiftKey && !altKey && key === "Control") {
      e.preventDefault();
      //挂载移动缩放遮罩
      isShowContainerMask.value = true;
    }
  };
  const containerFuncKeyUp = () => {
    //取消移动缩放遮罩
    isShowContainerMask.value = false;
  };
  return {
    containerFuncKeyDown,
    containerFuncKeyUp,
    isShowContainerMask,
  };
};
