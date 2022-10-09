import { useDraggerHandle } from "@/hooks/useDragEvent";
import { defineComponent, Ref } from "vue";
import { Component } from "../utils/editorComponentsConfig";
import { storeToRefs } from "pinia";
import { useJsonDataStore } from "@/stores/jsonData";
import { useDomRefStore } from "@/stores/domRef";
export default defineComponent({
  props: {
    component: { type: Object },
  },
  setup(props) {
    const component = props.component as Component;
    //全局data数据
    const JsonDataStore = useJsonDataStore();
    const { JsonData } = storeToRefs(JsonDataStore);
    const DomRefStore = useDomRefStore();
    const contentRef = storeToRefs(DomRefStore).contentRef as Ref<HTMLElement>;
    const { dragStart, dragEnd } = useDraggerHandle(JsonData, contentRef);
    return () => (
      <div
        class="editor-left-preview"
        draggable
        onDragstart={() => dragStart(component)}
        onDragend={dragEnd}>
        <span>{component.label}</span>
        {component.preview()}
      </div>
    );
  },
});
