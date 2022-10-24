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
    },
  },
];
