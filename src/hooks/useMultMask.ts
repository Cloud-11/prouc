import { Ref, ref } from "vue";
import { MaskArea, Container } from "..";

//框选
export default function useMultMask(
  multipleBlock: (maskArea: Ref<MaskArea>) => void,
  container: Ref<Container>
) {
  //渲染组件框选
  const isShowSelectMask = ref(false);
  let startPos = { x: 0, y: 0, cx: 0, cy: 0 };
  const maskArea: Ref<MaskArea> = ref({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });
  const initMaskPos = (e: MouseEvent) => {
    const { clientX, clientY, offsetX, offsetY } = e;
    const { offsetTop, offsetLeft } = e.target as HTMLElement;
    const { scale, offsetX: cx, offsetY: cy } = container.value;
    console.log(e);

    //记录初始位置
    startPos = {
      x: clientX,
      y: clientY,
      cx: clientX - offsetX - (offsetLeft + cx) / scale,
      cy: clientY - offsetY - (offsetTop + cy) / scale,
    };

    //绘制框选遮罩
    isShowSelectMask.value = true;
    maskArea.value.top = startPos.y - startPos.cy;
    maskArea.value.left = startPos.x - startPos.cx;
  };

  const maskMove = (e: MouseEvent) => {
    maskArea.value = {
      width: Math.abs(e.clientX - startPos.x),
      height: Math.abs(e.clientY - startPos.y),
      top: (e.clientY <= startPos.y ? e.clientY : startPos.y) - startPos.cy,
      left: (e.clientX <= startPos.x ? e.clientX : startPos.x) - startPos.cx,
    };
  };

  const resetMask = () => {
    isShowSelectMask.value = false;
    multipleBlock(maskArea);

    maskArea.value = {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    };
  };

  return { initMaskPos, maskMove, resetMask, maskArea, isShowSelectMask };
}
