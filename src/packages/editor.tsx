import { computed, ComputedRef, defineComponent, inject, provide, Ref, ref } from "vue";
import "./editor.scss";

import { DATA_JSON } from "../index";
import { ComponentsConfig } from "../utils/editorComponentsConfig";
import PreviewBlock from "../components/previewBlock";
import Content from "../components/content";
import { useDraggerHandle } from "../hooks/useDragEvent";
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
    //注册全局数据
    provide("JSON_DATA", data);
    //预览组件拖拽
    const contentRef = ref(null);
    const dragHandle = useDraggerHandle(data, contentRef);
    //组件数据
    const componentsConfig = inject("componentsConfig") as ComponentsConfig;

    return () => (
      <div class="editor">
        <div class="editor-left">
          {componentsConfig.componentList.map(component => (
            <PreviewBlock component={component} handle={dragHandle}></PreviewBlock>
          ))}
        </div>
        <div class="editor-container">
          <div class="editor-container-canvas">
            <Content contentRef={contentRef}></Content>
          </div>
          <aside>
            <div class="editor-container-setting">设置</div>
          </aside>
        </div>
      </div>
    );
  },
});
