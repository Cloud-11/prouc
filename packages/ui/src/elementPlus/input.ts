import { ProucComponent } from "@prouc/core";
export default new ProucComponent({
  name: "el-input",
  type: "form",
  label: "输入框",
  initProps: { placeholder: "默认输入框" },
  state: { input: "1231" },
  methods: {
    focus: {
      label: "获得焦点",
      desc: "	使 input 获取焦点",
      name: "focus",
    },
    blur: {
      label: "失去焦点",
      desc: "	使 input 失去焦点",
      name: "blur",
    },
    select: {
      label: "选中内容",
      desc: "选中 input 中的文字",
      name: "select",
    },
  },
  events: {
    blur: {
      label: "输入框失焦时",
      desc: "在 Input 失去焦点时触发",
      name: "el-input::blur",
      args: [{ name: "value", type: "string|number" }],
    },
    change: {
      label: "输入框内容改变时",
      desc: "仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发",
      name: "el-input::change",
      args: [{ name: "value", type: "string|number" }],
    },
  },
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
