import componentsConfig from "@prouc/components";
import { Block } from "@prouc/shared";
import { computed, defineComponent, reactive, Slot } from "vue";

export default defineComponent({
  props: {
    block: { type: Object },
  },
  setup(props, { slots, expose }) {
    const block = props.block as Block;
    const blockStyles = computed(() => {
      const { offsetY, offsetX, width, height, zIndex } = block.attr;
      return {
        width: width + "px",
        height: height + "px",
        top: offsetY + "px",
        left: offsetX + "px",
        zIndex: zIndex,
      };
    });
    const state: any = reactive({});
    console.log(block.propsData);
    if (block.propsData.modelValue?.[0][0] == "state") {
      console.log(block.propsData.modelValue[0][1]);
      state[block.propsData.modelValue[0][1]] = "";
    }
    if (block.state.expose) {
      expose(state);
    }

    // console.log(block.propsData?.modelValue);
    console.log(state);
    const propsData = computed(() => {
      return block.propsData;
    });
    const { render } = componentsConfig.componentMap[block.type];
    // let innerRender = () => {};
    // if (block.type == "group") {
    //   //组合
    //   innerRender = slots.default as Slot;
    // } else {
    //   innerRender = render(propsData, state);
    // }
    return () => (
      <div class="block" style={blockStyles.value}>
        {render(propsData, state)}
      </div>
    );
  },
});
