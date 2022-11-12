import { ProucComponent } from "@prouc/core";

export default new ProucComponent({
  name: "el-button",
  type: "basic",
  label: "按钮",
  initProps: { size: "default", type: "primary", plain: false, switch: false },
  state: {},
  slots: { default: () => "按钮" },
  methods: {
    focus: {
      label: "获得焦点",
      desc: "	使 input 获取焦点",
      name: "el-button:focus",
    },
    blur: {
      label: "失去焦点",
      desc: "	使 input 失去焦点",
      name: "el-button:blur",
    },
    select: {
      label: "选中内容",
      desc: "选中 input 中的文字",
      name: "el-button:select",
    },
  },
  events: {
    blur: {
      label: "输入框失焦时",
      desc: "在 Input 失去焦点时触发",
      name: "blur",
      args: [{ name: "value", type: "string|number" }],
    },
    change: {
      label: "输入框内容改变时",
      desc: "仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发",
      name: "change",
      args: [{ name: "value", type: "string|number" }],
    },
  },
  form: {
    rule: [
      {
        type: "select",
        field: "size",
        title: "尺寸",
        info: "",
        effect: {
          fetch: "",
        },
        options: [
          {
            value: "large",
            label: "large",
          },
          {
            value: "default",
            label: "default",
          },
          {
            label: "small",
            value: "small",
          },
        ],
        _fc_drag_tag: "select",
        hidden: false,
        display: true,
      },
      {
        type: "select",
        field: "type",
        title: "类型",
        info: "",
        effect: {
          fetch: "",
        },
        options: [
          {
            value: "primary",
            label: "primary",
          },
          {
            value: "success",
            label: "success",
          },
          {
            label: "warning",
            value: "warning",
          },
        ],
        _fc_drag_tag: "select",
        hidden: false,
        display: true,
      },
      {
        type: "switch",
        field: "plain",
        title: "是否为朴素按钮",
        info: "",
        props: {
          activeText: "是",
          inactiveText: "否",
          activeValue: true,
          inactiveValue: false,
        },
        _fc_drag_tag: "switch",
        hidden: false,
        display: true,
      },
    ],
    options: {},
  },
});
