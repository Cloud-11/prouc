import { Component, userConfig } from "@prouc/core";
import { Block } from "@prouc/shared";
import { computed, defineComponent, reactive } from "vue";
import _ from "lodash";

export default defineComponent({
  props: {
    block: { type: Object },
  },
  setup(props) {
    const block = props.block as Block;
    const blockStyles = computed(() => {
      const { offsetY, offsetX, width, height, zIndex } = block.attr;
      return {
        width: width + "px",
        height: height + "px",
        top: offsetY + "px",
        left: offsetX + "px",
        zIndex: zIndex,
        position: "absolute",
      };
    });
    const state: any = reactive({});
    if (
      !_.isEmpty(block.propsData.modelValue) &&
      block.propsData.modelValue?.[0][0] == "state"
    ) {
      console.log(block.propsData.modelValue[0][1]);
      state[block.propsData.modelValue[0][1]] = "";
    }
    const component = userConfig.componentList.get(block.type) as Component;
    return () =>
      component.render(
        { ...block.propsData, style: blockStyles.value },
        state,
        block.events
        // (block as Group).blocks ? blockSolts(block as Group) : null
      );
  },
});
