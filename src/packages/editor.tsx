import { computed, ComputedRef, defineComponent, inject, Ref, ref } from "vue";
import "./editor.scss";
import EditorBlock from "./block";
import { DATA_JSON } from "../index";
import { ComponentsConfig } from "../utils/editorComponentsConfig";
import PreviewBlock from "../components/previewBlock";
import { useDraggerHandle } from "../hooks/useDragEvent";
import { useBlocsFocus } from "../hooks/useBlockFocus";

export default defineComponent({
  props: {
    modelValue: { type: Object },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    //全局data数据
    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newValue) {
        emit("update:modelValue", newValue);
      },
    }) as ComputedRef<DATA_JSON>;
    //画布布局
    const containerStyles = computed(() => {
      const { width, height } = data.value.container;
      return {
        width: `${width.toString().indexOf("%") ? width : width + "px"}`,
        height: `${height.toString().indexOf("%") ? height : height + "px"}`,
      };
    });
    //组件数据
    const componentsConfig = inject("componentsConfig") as ComponentsConfig;
    //预览组件拖拽
    const contentRef = ref(null);
    const dragHandle = useDraggerHandle(data, contentRef);
    //渲染组件选择、拖拽、框选
    const maskRef = ref(null);
    const { blockMousedown, contentMousedown, is_show_mask, maskStyle } =
      useBlocsFocus(data);

    return () => (
      <div class="editor">
        <div class="editor-left">
          {componentsConfig.componentList.map(component => (
            <PreviewBlock component={component} handle={dragHandle}></PreviewBlock>
          ))}
        </div>
        <div class="editor-top">上</div>
        <div class="editor-right">右</div>
        <div class="editor-container">
          <div class="editor-container-canvas">
            <div
              class="editor-container-canvas-content"
              style={containerStyles.value}
              ref={contentRef}
              onMousedown={e => contentMousedown(e, contentRef, maskRef)}>
              <div
                class="mask"
                ref={maskRef}
                v-show={is_show_mask}
                style={maskStyle.value}></div>
              {data.value.blocks.map(block => (
                <EditorBlock
                  block={block}
                  onMousedown={(e: MouseEvent) => blockMousedown(e, block)}
                  class={block.focus ? "editor-block-focus" : ""}></EditorBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
