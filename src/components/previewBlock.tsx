import { defineComponent } from "vue";
import { Compontent } from "../utils/editorCompontentsConfig";
export default defineComponent({
  props: {
    component: { type: Object },
    handle: { type: Function },
  },
  setup(props) {
    const component = props.component as Compontent;
    const dragstartHandle = props.handle as (e: DragEvent, component: Compontent) => void;
    return () => (
      <div
        class="editor-left-preview"
        draggable
        onDragstart={e => dragstartHandle(e, component)}>
        <span>{component.label}</span>
        {component.preview()}
      </div>
    );
  },
});
