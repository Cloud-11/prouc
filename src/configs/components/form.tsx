import { Ref } from "vue";

export default [
  {
    label: "输入框",
    type: "input",
    preview: () => <el-input placeholder="预览input"></el-input>,
    render: (data: Ref<any>) => () =>
      <el-input {...data.value} placeholder="渲染input"></el-input>,
    setting: {
      form: {
        schema: {
          title: "输入框属性配置",
          type: "object",
          required: [],
          properties: {
            size: {
              title: "尺寸",
              type: "string",
              "ui:widget": "SelectWidget",
              default: "default",
              enum: ["large", "default", "small"],
              enumNames: ["large", "default", "small"],
            },
          },
          "ui:order": ["size"],
        },
        uiSchema: {},
        formFooter: {
          show: false,
        },
        formProps: { labelPosition: "right", labelWidth: "300px", labelSuffix: "：" },
      },
      methods: {
        focus: {
          label: "获得焦点",
          desc: "	使 input 获取焦点",
          action: "focus",
        },
        blur: {
          label: "失去焦点",
          desc: "	使 input 失去焦点",
          action: "blur",
        },
        select: {
          label: "选中内容",
          desc: "选中 input 中的文字",
          action: "select",
        },
      },
      events: {
        blur: {
          label: "输入框失焦时",
          desc: "在 Input 失去焦点时触发",
          event: "blur",
          args: [{ name: "value", type: "string|number" }],
        },
        change: {
          label: "输入框内容改变时",
          desc: "仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发",
          event: "change",
          args: [{ name: "value", type: "string|number" }],
        },
      },
    },
  },
];