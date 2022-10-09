import { defineComponent } from "vue";
import "./editor.scss";
import PreviewBlock from "../components/previewBlock";
import Content from "../components/content";
import { useComponentsConfigStore } from "@/stores/components";

export default defineComponent({
  setup() {
    //组件数据
    const { componentsConfig } = useComponentsConfigStore();
    return () => (
      <div class="editor">
        <div class="editor-left">
          {componentsConfig.componentList.map(component => (
            <PreviewBlock component={component}></PreviewBlock>
          ))}
        </div>
        <div class="editor-container">
          <div class="editor-container-canvas">
            <Content></Content>
          </div>
          <aside>
            <div class="editor-container-setting">设置</div>
          </aside>
        </div>
      </div>
    );
  },
});
