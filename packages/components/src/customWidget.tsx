import { defineComponent, h, Ref, resolveComponent } from "vue";

export const cascaderWidget = defineComponent({
  props: {
    options: {
      default: () => [],
      type: [Array],
    },
  },
  setup(props, { attrs }) {
    console.log(props);
    return () =>
      h(resolveComponent("el-cascader"), {
        modelValue: attrs.modelValue,
        options: props.options,
      });
  },
});
