import componentsConfig from "@/configs/components";
import { computed, defineComponent, Slot } from "vue";
import { Block } from "..";

export default defineComponent({
  props: {
    block: { type: Object },
  },
  setup(props, { slots }) {
    const block = props.block as Block;
    const blockStyles = computed(() => {
      const { offsetY, offsetX, width, height, zIndex } = block.attr;
      const blockstyle = {
        top: offsetY + "px",
        left: offsetX + "px",
        zIndex: zIndex,
      };
      return width === 0 && height === 0
        ? blockstyle
        : {
            ...blockstyle,
            width: width + "px",
            height: height + "px",
          };
    });
    const propsData = computed(() => block.propsData);
    const { render, setting } = componentsConfig.componentMap[block.type];
    let innerRender = () => {};
    if (block.type == "group") {
      //组合
      innerRender = slots.default as Slot;
    } else {
      innerRender = render(propsData);
    }
    return () => (
      <div class="block" style={blockStyles.value}>
        {innerRender()}
      </div>
    );
  },
});
