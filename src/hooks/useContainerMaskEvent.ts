import _ from "lodash";
import { Ref, watch } from "vue";
import { Container } from "../index.d";

export default function useContainerMaskEvent(
  containerMaskRef: Ref<HTMLElement>,
  container: Ref<Container>,
  isShowContainerMask: Ref<boolean>
) {
  let mousePos = { x: 0, y: 0 };
  const containerMaskMouseDown = (e: MouseEvent) => {
    // e.preventDefault();
    e.stopPropagation();
    mousePos.x = e.clientX - container.value.offsetX;
    mousePos.y = e.clientY - container.value.offsetY;

    containerMaskRef.value.addEventListener("mousemove", containerMaskMouseMove);
    containerMaskRef.value.addEventListener("mouseup", containerMaskMouseUp);
  };
  const containerMaskMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const durx = clientX - mousePos.x;
    const dury = clientY - mousePos.y;
    container.value.offsetX = durx;
    container.value.offsetY = dury;
  };
  const containerMaskMouseUp = () => {
    mousePos = { x: 0, y: 0 };
    containerMaskRef.value.removeEventListener("mousemove", containerMaskMouseMove);
    containerMaskRef.value.removeEventListener("mouseup", containerMaskMouseUp);
  };
  //不显示 移除事件监听
  watch(isShowContainerMask, () => containerMaskMouseUp());
  const containerMaskMousewheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      //上滚 放大
      if (container.value.scale >= 1.5) return;
      container.value.scale = parseFloat((container.value.scale + 0.1).toFixed(1));
    } else if (e.deltaY > 0) {
      if (container.value.scale <= 0.3) return;
      container.value.scale = parseFloat((container.value.scale - 0.1).toFixed(1));
    }
  };

  return { containerMaskMouseDown, containerMaskMousewheel };
}
