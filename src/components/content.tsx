import { computed, defineComponent } from "vue";
import EditorBlock from "../packages/block";
import { useContentEvent } from "../hooks/useContentEvent";
import { storeToRefs } from "pinia";
import {
  useJsonDataStore,
  useDomRefStore,
  useGlobalDataStore,
  useRightMenuStore,
  useRightMenuOptsStore,
} from "@/stores";
import { useRightMenu } from "@/hooks/useRightMenu";
import { Group } from "./../index.d";

export default defineComponent({
  setup() {
    const { container, blocks } = storeToRefs(useJsonDataStore());
    const { clearFocusBlock, multipleBlock } = useJsonDataStore();
    const { contentRef } = storeToRefs(useDomRefStore());
    const { markLine } = storeToRefs(useGlobalDataStore());

    //显示右键菜单
    const { showsMenu, setMenuPos, hiddenMenu } = useRightMenuStore();
    const { setMenus } = useRightMenuOptsStore();
    const { showRightMenu } = useRightMenu(showsMenu, setMenuPos, hiddenMenu, setMenus);
    //画布布局
    const containerStyles = computed(() => {
      const { width, height } = container.value;
      return {
        width: `${width.toString().indexOf("%") !== -1 ? width : width + "px"}`,
        height: `${height.toString().indexOf("%") !== -1 ? height : height + "px"}`,
      };
    });

    //外围容器 框选
    const { contentMousedown, maskArea, is_show_mask } = useContentEvent(
      clearFocusBlock,
      multipleBlock
    );
    const maskStyle = computed(() => ({
      width: maskArea.value.width + "px",
      height: maskArea.value.height + "px",
      top: maskArea.value.top + "px",
      left: maskArea.value.left + "px",
    }));
    return () => (
      <div
        class="editor-container-canvas-content"
        style={containerStyles.value}
        ref={contentRef}
        onContextmenu={(e: MouseEvent) => showRightMenu(e, "canvasMenus")}
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
        {Array.from(blocks.value.values()).map(block => {
          return block.type == "group" ? (
            <EditorBlock
              key={block.id}
              block={block}
              class={block.focus ? "editor-block-focus" : ""}>
              {(block as Group).blocks.map(block => (
                <EditorBlock
                  //TODO v-key={block.id}  不能加id 组合会报错 ?
                  block={block}
                  class={block.focus ? "editor-block-focus" : ""}></EditorBlock>
              ))}
            </EditorBlock>
          ) : (
            <EditorBlock
              key={block.id}
              block={block}
              class={block.focus ? "editor-block-focus" : ""}></EditorBlock>
          );
        })}
      </div>
    );
  },
});
