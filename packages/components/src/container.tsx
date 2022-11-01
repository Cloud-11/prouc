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
        rule: [
          {
            type: "span",
            title: "组合容器属性配置",
            native: false,
            children: [""],
            _fc_drag_tag: "span",
            hidden: false,
            display: true,
          },
        ],
        options: {},
        initData: {},
      },
      events: {},
      methods: {},
    },
  },
];
