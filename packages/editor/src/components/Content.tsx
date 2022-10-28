// import { computed, defineComponent } from "vue";
import EditorBlock from "@/components/EditorBlock";
import { storeToRefs } from "pinia";
import {
  useJsonDataStore,
  useDomRefStore,
  useGlobalDataStore,
  useRightMenuStore,
  useRightMenuOptsStore,
} from "@/stores";
import { useRightMenu } from "@/hooks/useRightMenu";
import MarkLine from "@/components/MarkLine";

export default defineComponent({
  setup() {
    const { container, blocks } = storeToRefs(useJsonDataStore());
    const { contentRef } = storeToRefs(useDomRefStore());
    const { markLine } = storeToRefs(useGlobalDataStore());

    //显示右键菜单
    const { showsMenu, setMenuPos, hiddenMenu } = useRightMenuStore();
    const { setMenus } = useRightMenuOptsStore();
    const { showRightMenu } = useRightMenu(showsMenu, setMenuPos, hiddenMenu, setMenus);
    //画布布局
    const containerStyles = computed(() => {
      const { width, height, scale, offsetX, offsetY } = container.value;
      return {
        transform: `scale(${scale})`,
        translate: `${offsetX}px ${offsetY}px`,
        width: `${width}px`,
        height: `${height}px`,
      };
    });

    return () => (
      <div
        class="editor-container-canvas-content"
        style={containerStyles.value}
        ref={contentRef}
        onContextmenu={(e: MouseEvent) => showRightMenu(e, "canvasMenus")}>
        <MarkLine line={markLine}></MarkLine>
        {Array.from(blocks.value.values()).map(block => (
          <EditorBlock
            key={block.id}
            block={block}
            class={block.status.focus ? "editor-block-focus" : ""}></EditorBlock>
        ))}
      </div>
    );
  },
});
