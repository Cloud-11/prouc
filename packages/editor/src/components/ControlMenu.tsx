// import { defineComponent } from "vue";
// import { reactive } from "vue";
import { Undo, Upload, Download, Send } from "@icon-park/vue-next";
// import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useJsonDataStore } from "@/stores/jsonData";
import { replacer } from "@prouc/shared";
// import { ElButton } from "element-plus";

export default defineComponent({
  components: {
    // ElButton,
    Undo,
    Upload,
    Download,
    Send,
  },
  setup() {
    const router = useRouter();
    const { blocks } = storeToRefs(useJsonDataStore());
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
        {
          lable: "预览",
          icon: () => <send theme="outline" size="24" fill="#1890ff" />,
          handler: () => {
            const saveData = JSON.stringify(blocks.value, replacer);
            localStorage.setItem("blocks", saveData);
            const { href } = router.resolve({
              path: "/preview",
            });
            window.open(href, "_blank");
          },
        },
      ],
    });
    return () =>
      state.buttons.map(button => (
        <el-button v-slots={{ icon: button.icon }} onClick={button.handler}>
          {button.lable}
        </el-button>
      ));
  },
});
