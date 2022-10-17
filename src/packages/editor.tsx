import { defineComponent } from "vue";
import "./editor.scss";
import PreviewBlock from "@/components/previewBlock";
import Container from "@/components/Container";
import { useComponentsConfigStore } from "@/stores/components";
import { AllApplication } from "@icon-park/vue-next";

export default defineComponent({
  components: {
    AllApplication,
  },
  setup() {
    //组件数据
    const { componentsConfig } = useComponentsConfigStore();

    return () => (
      <div class="editor">
        <div class="editor-components">
          <div class="editor-components-class">
            <div class="editor-components-class-item">
              <span>
                <all-application theme="outline" size="16" fill="#1890ff" />
              </span>
              <span>基础组件</span>
            </div>
            <div class="editor-components-class-item">表单组件</div>
            <div class="editor-components-class-item">媒体组件</div>
          </div>
          <div class="editor-components-list">
            {componentsConfig.componentList.map(component => (
              <PreviewBlock component={component}></PreviewBlock>
            ))}
          </div>
        </div>
        <div class="editor-container">
          <Container></Container>
        </div>
        <aside>
          <div class="editor-container-setting">设置</div>
        </aside>
      </div>
    );
  },
});
