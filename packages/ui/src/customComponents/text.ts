import { ProucComponent } from "@prouc/core";
import { defineComponent, h } from "vue";

export const ProucText = defineComponent({
  props: ["modelValue"],
  name: "prouc-text",
  setup(props, { slots, expose }) {
    const aaa = () => {
      console.log(props);
    };
    expose({ aaa });
    return () => h("div", null, slots);
  },
});

export default new ProucComponent({
  name: "prouc-text",
  type: "basic",
  label: "文本",
  initProps: {},
  methods: {},
  events: {},
  state: { text: "默认文本" },
  slots: { default: () => "默认文本" },
  form: {
    rule: [
      {
        type: "cascader",
        field: "modelValue",
        title: "组件绑定数据源",
        info: "",
        effect: {
          fetch: "",
        },
        props: {
          options: [
            {
              label: "全局数据",
              value: "global",
              children: [
                {
                  label: "全局数据",
                  value: "global",
                },
                {
                  label: "store",
                  value: "store",
                },
              ],
            },
            {
              label: "组件数据",
              value: "state",
              children: [
                {
                  label: "文本绑定值",
                  value: "modelValue",
                },
              ],
            },
          ],
          props: {
            expandTrigger: "click",
            multiple: true,
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
