import { Component } from "@prouc/core";
export default new Component({
  name: "el-input",
  type: "form",
  label: "输入框",
  setting: {
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
    form: {
      rule: [
        {
          type: "span",
          title: "输入框属性配置",
          native: false,
          children: [""],
          _fc_drag_tag: "span",
          hidden: false,
          display: true,
        },
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
      initData: { modelValue: [] },
    },
  },
});
