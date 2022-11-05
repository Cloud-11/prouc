import { defineComponent, ref } from "vue";
import "./editor.scss";
import PreviewBlock from "@/components/PreviewBlock";
import Container from "@/components/Container";
import ToolsBar from "@/components/ToolsBar";
import ComponentsCategory from "@/components/ComponentsCategory";
import ComponentSetting from "@/components/Setting";
import { userConfig } from "@prouc/core";

export default defineComponent({
  setup() {
    //组件数据
    const activeCategory = ref("");
    userConfig.categoryList.forEach(category => {
      if (category.active) {
        activeCategory.value = category.name;
        return;
      }
    });
    return () => (
      <div class="editor">
        <div class="editor-components">
          <ComponentsCategory
            v-model={activeCategory.value}
            categoryList={userConfig.categoryList}></ComponentsCategory>
          <div class="editor-components-list">
            {userConfig.componentCategoryList
              .get(activeCategory.value)
              ?.map(component => (
                <PreviewBlock key={component.name} component={component}></PreviewBlock>
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
