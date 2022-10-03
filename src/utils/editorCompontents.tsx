export default [
  {
    label: "文本",
    type: "text",
    preview: () => "预览文本",
    render: () => "渲染文本",
  },
  {
    label: "按钮",
    type: "button",
    preview: () => <el-button>预览按钮</el-button>,
    render: () => <el-button>渲染按钮</el-button>,
  },
  {
    label: "输入框",
    type: "input",
    preview: () => <el-input placeholder="预览input"></el-input>,
    render: () => <el-input placeholder="渲染input"></el-input>,
  },
];
