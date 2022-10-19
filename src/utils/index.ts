import { Ref } from "vue";
import { Block, Container, MaskArea } from "../index";

const collide = (
  rect1: Block,
  rect2: Ref<MaskArea>,
  contentRef: Ref<HTMLElement | null>,
  container: Ref<Container>
) => {
  const { width: w, height: h, offsetX, offsetY } = rect1.attr;
  const { width, height, top, left } = rect2.value;
  const { offsetTop: ctt, offsetLeft: ctl } = contentRef.value as HTMLElement;
  const { width: cw, height: ch, scale, offsetX: cx, offsetY: cy } = container.value;

  // container.top
  //       +content.top+(content.height*(1-scale))/2
  //       +(block.top*scale)

  //  cl+ctl+(cw*(1-scale))/2+offsetX*scale
  const cwS = (cw * (1 - scale)) / 2;
  // const wS = (w * (1 - scale)) / 2;
  const chS = (ch * (1 - scale)) / 2;
  // const hS = (h * (1 - scale)) / 2;
  const maxX = Math.max(ctl + cwS + offsetX * scale + w * scale + cx, left + width);
  const maxY = Math.max(ctt + chS + offsetY * scale + h * scale + cy, top + height);
  const minX = Math.min(ctl + cwS + offsetX * scale + cx, left);
  const minY = Math.min(ctt + chS + offsetY * scale + cy, top);

  if (maxX - minX <= w * scale + width && maxY - minY <= h * scale + height) {
    return true;
  } else {
    return false;
  }
};
export { collide };
