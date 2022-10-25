import { Ref } from "vue";

export default [
  {
    label: "文本",
    type: "text",
    preview: () => <div>预览文本</div>,
    render: (data: Ref<any>) => () => <div>{() => data.value.text || "渲染文本"}</div>,
    setting: {
      form: {
        schema: {
          title: "文本属性配置",
          type: "object",
          required: [],
          properties: {
            text: {
              title: "文本内容",
              type: "string",
              "ui:options": {
                placeholder: "请输入",
              },
            },
          },
          "ui:order": ["text"],
        },
        uiSchema: {},
        formFooter: {
          show: false,
        },
        formProps: { labelPosition: "right", labelWidth: "300px", labelSuffix: "：" },
      },
      events: {},
      methods: {},
    },
  },
  {
    label: "按钮",
    type: "button",
    preview: () => <el-button>预览按钮</el-button>,
    render: (data: Ref<any>) => () => <el-button {...data.value}>渲染按钮</el-button>,
    setting: {
      form: {
        schema: {
          title: "按钮属性配置",
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
            type: {
              title: "类型",
              type: "string",
              default: "primary",
              "ui:widget": "SelectWidget",
              enum: ["primary", "success", "warning"],
              enumNames: ["primary", "success", "warning"],
            },
            plain: {
              title: "是否为朴素按钮",
              type: "boolean",
              default: "false",
              "ui:options": {
                activeText: "是",
                inactiveText: "否",
              },
            },
          },
          "ui:order": ["size", "type", "plain"],
        },
        uiSchema: {
          "ui:options": {
            fieldStyle: {
              margin: "20px",
            },
          },
        },
        formFooter: {
          show: false,
        },
        formProps: {
          labelPosition: "right",
          labelWidth: "300px",
          labelSuffix: "：",
        },
      },
      events: {},
      methods: {},
    },
  },
];
