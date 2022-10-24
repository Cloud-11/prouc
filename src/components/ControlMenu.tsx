import { defineComponent } from "vue";
import { reactive } from "vue";
import { Undo, Upload, Download, Send } from "@icon-park/vue-next";
export default defineComponent({
  components: {
    Undo,
    Upload,
    Download,
    Send,
  },
  setup() {
    const state = reactive({
      buttons: [
        {
          lable: "撤销",
          icon: () => <Undo theme="outline" size="24" fill="#1890ff" />,
        },
        {
          lable: "导入",
          icon: () => <upload theme="outline" size="24" fill="#1890ff" />,
        },
        {
          lable: "导出",
          icon: () => <download theme="outline" size="24" fill="#1890ff" />,
        },
        {
          lable: "预览",
          icon: () => <send theme="outline" size="24" fill="#1890ff" />,
        },
      ],
    });
    return () =>
      state.buttons.map(button => (
        <el-button v-slots={{ icon: button.icon }}>{button.lable}</el-button>
      ));
  },
});
