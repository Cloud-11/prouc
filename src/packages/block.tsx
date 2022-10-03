import { computed, defineComponent, inject } from "vue";
import { Block } from "..";
import { CompontentsConfig } from "../utils/editorCompontentsConfig";

export default defineComponent({
  props: {
    block: { type: Object },
  },
  setup(props) {
    const block = props.block as Block;
    const blockStyles = computed(() => ({
      top: block.top + "px",
      left: block.left + "px",
      zIndex: block.zIndex,
    }));
    const compontentsConfig = inject("compontentsConfig") as CompontentsConfig;
    const { label, preview, render } = compontentsConfig.compontentMap[block.type];

    return () => (
      <div class="editor-block" style={blockStyles.value}>
        {render()}
      </div>
    );
  },
});
