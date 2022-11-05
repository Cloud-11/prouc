import { Components } from "@prouc/core";

const component = new Components({
  name: "div",
  type: "basic",
  label: "文本",
  setting: {
    methods: {},
    events: {},
  },
});
const form = {
  rule: [
    {
      type: "input",
      field: "text",
      title: "文本内容",
      info: "",
      _fc_drag_tag: "input",
      hidden: false,
      display: true,
    },
  ],
  options: {},
  initData: { text: "" },
};

export default { component, form };
