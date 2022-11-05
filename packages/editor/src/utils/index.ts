import { Block, Container, MaskArea } from "@prouc/shared";
import { Ref } from "vue";
import { Router } from "vue-router";

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

  return maxX - minX <= w * scale + width && maxY - minY <= h * scale + height;
};
export interface PreviewModeOption {
  mode: "none" | "newWindow" | "currentWindow";
  router?: Router;
  path?: string;
}
//全局初始化配置 无法使用pinia
let previewMode: PreviewModeOption = reactive({ mode: "none" });
const setPreviewMode = (option: PreviewModeOption) => {
  previewMode = option;
};
const getPreviewMode = () => {
  return previewMode;
};

/**
 * 判断是否是大写
 * @param s
 */
const isUpperCase = (s: string) => {
  return s === s.toLocaleUpperCase();
};

/**
 * 驼峰转中线
 * @param str
 */
const translateCamelCase = (str: string) => {
  let str_arr = str.split("");
  str_arr.forEach((value, index) => {
    if (isUpperCase(value)) {
      str_arr[index] = `${index == 0 ? "" : "-"}${value.toLocaleLowerCase()}`;
    }
  });
  return str_arr.join("").slice(1);
};

export { collide, setPreviewMode, getPreviewMode, translateCamelCase };
