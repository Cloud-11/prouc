import editorCompontentsList from "./editorCompontents";

export interface Compontent {
  label: string;
  type: string;
  preview: () => any;
  render: () => any;
}

export interface CompontentsConfig {
  compontentList: Compontent[];
  compontentMap: { [key: string]: Compontent };
  register: (compontent: Compontent) => void;
}

function createEditorConfig(): CompontentsConfig {
  const compontentList: Compontent[] = [];
  const compontentMap: CompontentsConfig["compontentMap"] = {};
  return {
    compontentList,
    compontentMap,
    register: (compontent: Compontent) => {
      compontentList.push(compontent);
      compontentMap[compontent.type] = compontent;
    },
  };
}
const compontentsConfig = createEditorConfig();

//注册组件
editorCompontentsList.forEach(component => {
  compontentsConfig.register(component);
});

export default compontentsConfig;
