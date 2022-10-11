import { Ref } from "vue";
import { Block, MaskArea } from "../index";

const collide = (rect1: Block, rect2: Ref<MaskArea>) => {
  const { width, height, top, left } = rect2.value;
  const maxX = Math.max(rect1.left + rect1.width, left + width);
  const maxY = Math.max(rect1.top + rect1.height, top + height);
  const minX = Math.min(rect1.left, left);
  const minY = Math.min(rect1.top, top);
  if (maxX - minX <= rect1.width + width && maxY - minY <= rect1.height + height) {
    return true;
  } else {
    return false;
  }
};
export { collide };
