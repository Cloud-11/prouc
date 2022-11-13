import { ProucComponent } from "@prouc/core";
import { defineComponent, h } from "vue";

export const ProucText = defineComponent({
  props: ["text"],
  name: "prouc-text",
  setup(props, { slots, expose }) {
    const aaa = () => {
      console.log(props);
    };
    expose({ aaa });
    return () => h("div", null, props.text);
  },
});

export default new ProucComponent({
  name: "prouc-text",
  type: "basic",
  label: "文本",
  initProps: { text: "默认文本" },
  methods: {},
  events: {},
  state: { text: "默认文本" },
  slots: { default: () => "默认文本" },
  form: {
    rule: [
      {
        type: "cascader",
        field: "text",
        title: "文本数据源",
        info: "",
        effect: {
          fetch: "",
        },
        props: {
          options: "AllDataOptions",
          props: {
            expandTrigger: "click",
            emitPath: true,
          },
        },
        _fc_drag_tag: "cascader",
        hidden: false,
        display: true,
      },
    ],
    options: {},
  },
});
