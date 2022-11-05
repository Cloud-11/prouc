import { useDraggerHandle } from "@/hooks/useDragEvent";
import { Ref } from "vue";
import { Component } from "@prouc/core";
import { storeToRefs } from "pinia";
import { useJsonDataStore, useDomRefStore } from "@/stores/";

export default defineComponent({
  props: {
    component: { type: Object },
  },
  setup(props) {
    const component = props.component as Component;
    //全局data数据
    const { addBlock } = useJsonDataStore();
    const DomRefStore = useDomRefStore();
    const contentRef = storeToRefs(DomRefStore).contentRef as Ref<HTMLElement>;
    const { dragStart, dragEnd } = useDraggerHandle(addBlock, contentRef);
    return () => (
      <div
        class="editor-components-list-preview"
        draggable="true"
        onDragstart={() => dragStart(component)}
        onDragend={dragEnd}>
        <span>{component.label}</span>
        {component.showRender()}
      </div>
    );
  },
});
