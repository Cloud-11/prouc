import { Ref } from "vue";

export default [
  {
    label: "组合容器",
    type: "group",
    preview: () => (
      <div style={{ width: "50px", height: "50px", border: "2px solid blue" }}></div>
    ),
    render: (props?: Ref<any>, event?: Ref<any>, solts?: any) => () =>
      <div {...props?.value}>{solts}</div>,
    setting: {
      form: {
        schema: {
          title: "组合容器属性配置",
          type: "object",
          required: [],
          properties: {
            // size: {
            //   title: "尺寸",
            //   type: "string",
            //   "ui:widget": "SelectWidget",
            //   default: "default",
            //   enum: ["large", "default", "small"],
            //   enumNames: ["large", "default", "small"],
            // },
          },
          "ui:order": [],
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
];
