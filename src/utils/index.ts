import { Ref } from "vue";
import { Block, Container, MaskArea } from "../index";

const collide = (
  rect1: Block,
  rect2: Ref<MaskArea>,
  containerRef: Ref<HTMLElement | null>,
  container: Ref<Container>
) => {
  const { width: w, height: h, x, y } = rect1.attr;
  const { width, height, top, left } = rect2.value;
  const { scale } = container.value;
  const containerBox = (containerRef.value as HTMLElement).offsetParent as HTMLElement;
  const { offsetLeft: cl, offsetTop: ct } = containerBox;
  // container.top
  //       +content.top+(content.height*(1-scale))/2
  //       +(block.top*scale)

  //  cl+ctl+(cw*(1-scale))/2+offsetX*scale
  // const cwS = (cw * (1 - scale)) / 2;
  // const wS = (w * (1 - scale)) / 2;
  // const chS = (ch * (1 - scale)) / 2;
  // const hS = (h * (1 - scale)) / 2;
  const maxX = Math.max(x + w * scale, cl + left + width);
  const maxY = Math.max(y + h * scale, ct + top + height);
  const minX = Math.min(x, cl + left);
  const minY = Math.min(y, ct + top);

  if (maxX - minX <= w * scale + width && maxY - minY <= h * scale + height) {
    return true;
  } else {
    return false;
  }
};

const replacer = function (key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
};

const reviver = function (key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
};

export { collide, replacer, reviver };
