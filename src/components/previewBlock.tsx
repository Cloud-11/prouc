import { defineComponent } from "vue";
import { Component } from "../utils/editorComponentsConfig";

export default defineComponent({
  props: {
    component: { type: Object },
    handle: { type: Object },
  },
  setup(props) {
    const component = props.component as Component;
    const { dragStart, dragEnd } = props.handle as {
      dragStart: (e: DragEvent, component: Component) => void;
      dragEnd: () => void;
    };
    return () => (
      <div
        class="editor-left-preview"
        draggable
        onDragstart={e => dragStart(e, component)}
        onDragend={dragEnd}>
        <span>{component.label}</span>
        {component.preview()}
      </div>
    );
  },
});
