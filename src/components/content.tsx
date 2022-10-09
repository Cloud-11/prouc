import { computed, defineComponent, inject, Ref, ref } from "vue";
import { DATA_JSON } from "..";
import EditorBlock from "../packages/block";
import { useBlocsFocus } from "../hooks/useBlockEvent";
import { useContentEvent } from "../hooks/useContentEvent";

export default defineComponent({
  props: {
    contentRef: { type: Object },
  },
  setup(props) {
    const data = inject("JSON_DATA") as Ref<DATA_JSON>;

    //画布布局
    const containerStyles = computed(() => {
      const { width, height } = data.value.container;
      return {
        width: `${width.toString().indexOf("%") !== -1 ? width : width + "px"}`,
        height: `${height.toString().indexOf("%") !== -1 ? height : height + "px"}`,
      };
    });

    //渲染组件选择、拖拽
    const { blockMousedown, markLine } = useBlocsFocus(data);
    //外围容器 框选
    const { contentMousedown, maskStyle, is_show_mask } = useContentEvent(data, markLine);
    return () => (
      <div
        class="editor-container-canvas-content"
        style={containerStyles.value}
        ref={props.contentRef as Ref}
        onMousedown={e => contentMousedown(e, props.contentRef as Ref)}>
        {markLine.x == null ? (
          ""
        ) : (
          <div class="line-x" style={{ left: markLine.x + "px" }}></div>
        )}
        {markLine.y == null ? (
          ""
        ) : (
          <div class="line-y" style={{ top: markLine.y + "px" }}></div>
        )}
        <div class="mask" v-show={is_show_mask} style={maskStyle.value}></div>
        {data.value.blocks.map(block => (
          <EditorBlock
            block={block}
            onMousedown={(e: MouseEvent) =>
              blockMousedown(e, block, props.contentRef as Ref)
            }
            class={block.focus ? "editor-block-focus" : ""}></EditorBlock>
        ))}
      </div>
    );
  },
});
