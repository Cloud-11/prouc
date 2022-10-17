import { Ref } from "vue";
import { Block, Container, MaskArea } from "../index";

const collide = (
  rect1: Block,
  rect2: Ref<MaskArea>,
  contentRef: Ref<HTMLElement | null>,
  container: Ref<Container>
) => {
  const {
    attr: { width: w, height: h, offsetX, offsetY },
  } = rect1;
  const { width, height, top, left } = rect2.value;
  const { offsetLeft, offsetTop } = contentRef.value as HTMLElement;
  const { scale, offsetX: cx, offsetY: cy } = container.value;
  const maxX = Math.max(offsetX + (offsetLeft + cx) / scale + h, left + width);
  const maxY = Math.max(offsetY + (offsetTop + cy) / scale + h, top + height);
  const minX = Math.min(offsetX + (offsetLeft + cx) / scale, left);
  const minY = Math.min(offsetY + (offsetTop + cy) / scale, top);
  if (maxX - minX <= w + width && maxY - minY <= h + height) {
    return true;
  } else {
    return false;
  }
};
export { collide };
