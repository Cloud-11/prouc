import { computed, ComputedRef, defineComponent, inject, ref } from "vue";
import "./editor.scss";
import EditorBlock from "./block";
import { DATA_JSON } from "../index";
import { CompontentsConfig } from "../utils/editorCompontentsConfig";
import PreviewBlock from "../components/previewBlock";
import { useDragstartHandle, useDrop } from "../hooks/useDragEvent";

export default defineComponent({
  props: {
    modelValue: { type: Object },
  },
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
    const containerStyles = computed(() => ({
      width: data.value.container.width + "px",
      height: data.value.container.height + "px",
    }));
    //组件数据
    const compontentsConfig = inject("compontentsConfig") as CompontentsConfig;
    const contentRef = ref(null);
    const drop = useDrop(data);
    const dragstartHandle = useDragstartHandle(drop, contentRef);
    return () => (
      <div class="editor">
        <div class="editor-left">
          {compontentsConfig.compontentList.map(component => (
            <PreviewBlock component={component} handle={dragstartHandle}></PreviewBlock>
          ))}
        </div>
        <div class="editor-top">上</div>
        <div class="editor-right">右</div>
        <div class="editor-container">
          <div class="editor-container-canvas">
            <div
              class="editor-container-canvas-content"
              style={containerStyles.value}
              ref={contentRef}>
              {data.value.blocks.map(block => (
                <EditorBlock block={block}></EditorBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
