import { Ref } from "vue";

export default [
  {
    label: "文本",
    type: "text",
    preview: () => <div>预览文本</div>,
    render: (data: Ref<any>) => () => <div>{() => data.value.text || "渲染文本"}</div>,
    setting: {
      form: {
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
        initData: { size: "default", type: "primary", plain: false, switch: false },
      },
      events: {},
      methods: {},
    },
  },
];
