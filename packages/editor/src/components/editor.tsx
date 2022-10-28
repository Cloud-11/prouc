import { defineComponent, Ref, ref } from "vue";
import "./editor.scss";
import PreviewBlock from "@/components/PreviewBlock";
import Container from "@/components/Container";
import ToolsBar from "@/components/ToolsBar";
import ComponentsClassRadio from "@/components/ComponentClassRadio";
import ComponentSetting from "@/components/Setting";
import componentsConfig from "@prouc/components";

export default defineComponent({
  setup() {
    //组件数据
    const componentClass = ref("basic") as Ref<"basic" | "form" | "container">;
    return () => (
      <div class="editor">
        <div class="editor-components">
          <ComponentsClassRadio v-model={componentClass.value}></ComponentsClassRadio>
          <div class="editor-components-list">
            {componentsConfig.componentsList[componentClass.value].map(component => (
              <PreviewBlock key={component.type} component={component}></PreviewBlock>
            ))}
          </div>
        </div>
        <div class="editor-container">
          <Container></Container>
          <ToolsBar></ToolsBar>
        </div>
        <aside style={{ boxShadow: "-2px 0 4px 0 rgb(0 0 0 / 10%)" }}>
          <ComponentSetting></ComponentSetting>
        </aside>
      </div>
    );
  },
});
