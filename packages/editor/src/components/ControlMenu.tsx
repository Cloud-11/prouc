import { Undo, Upload, Download, Send } from "@icon-park/vue-next";
import { storeToRefs } from "pinia";
import { useJsonDataStore } from "@/stores";
import { replacer } from "@prouc/shared";
import {getPreviewMode} from "@/utils";

export default defineComponent({
  components: {
    Undo,
    Upload,
    Download,
    Send,
  },
  setup() {
    const { blocks } = storeToRefs(useJsonDataStore());
     const  previewMode  = getPreviewMode();
    const state = reactive({
      buttons: [
        {
          lable: "撤销",
          icon: () => <Undo theme="outline" size="24" fill="#1890ff" />,
          handler: () => {},
        },
        {
          lable: "导入",
          icon: () => <upload theme="outline" size="24" fill="#1890ff" />,
          handler: () => {},
        },
        {
          lable: "导出",
          icon: () => <download theme="outline" size="24" fill="#1890ff" />,
          handler: () => {},
        },
      ],
    });
    if (previewMode.mode !== "none") {
      state.buttons.push({
        lable: "预览",
        icon: () => <send theme="outline" size="24" fill="#1890ff" />,
        handler: () => {
          const saveData = JSON.stringify(blocks.value, replacer);
          localStorage.setItem("blocks", saveData);
          if (previewMode.router && previewMode.path) {
            if (previewMode.mode == "newWindow") {
              const { href } = previewMode.router.resolve({
                path: previewMode.path,
              });
              window.open(href, "_blank");
            } else {
              previewMode.router.push(previewMode.path);
            }
          } else {
            new Error(
              "预览页面路由 router 或 path 未传入,需要传入Router对象和path ,不需要预览设置mode='none'"
            );
          }
        },
      });
    }
    return () =>
      state.buttons.map(button => (
        <el-button v-slots={{ icon: button.icon }} onClick={button.handler}>
          {button.lable}
        </el-button>
      ));
  },
});
