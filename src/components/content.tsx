import { computed, defineComponent } from "vue";
import EditorBlock from "../packages/block";
import { useContentEvent } from "../hooks/useContentEvent";
import { storeToRefs } from "pinia";
import { useJsonDataStore, useDomRefStore, useGlobalDataStore } from "@/stores";

export default defineComponent({
  setup() {
    const { JsonData } = storeToRefs(useJsonDataStore());
    const DomRefStore = useDomRefStore();
    const { contentRef } = storeToRefs(DomRefStore);
    const globalDataStore = useGlobalDataStore();
    const { markLine } = storeToRefs(globalDataStore);
    //画布布局
    const containerStyles = computed(() => {
      const { width, height } = JsonData.value.container;
      return {
        width: `${width.toString().indexOf("%") !== -1 ? width : width + "px"}`,
        height: `${height.toString().indexOf("%") !== -1 ? height : height + "px"}`,
      };
    });

    //外围容器 框选
    const { contentMousedown, maskStyle, is_show_mask } = useContentEvent(JsonData);
    return () => (
      <div
        class="editor-container-canvas-content"
        style={containerStyles.value}
        ref={contentRef}
        onMousedown={e => contentMousedown(e, contentRef, markLine)}>
        {markLine.value.x == null ? (
          ""
        ) : (
          <div class="line-x" style={{ left: markLine.value.x + "px" }}></div>
        )}
        {markLine.value.y == null ? (
          ""
        ) : (
          <div class="line-y" style={{ top: markLine.value.y + "px" }}></div>
        )}
        <div class="mask" v-show={is_show_mask} style={maskStyle.value}></div>
        {JsonData.value.blocks.map(block => (
          <EditorBlock
            block={block}
            class={block.focus ? "editor-block-focus" : ""}></EditorBlock>
        ))}
      </div>
    );
  },
});
