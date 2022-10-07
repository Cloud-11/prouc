import { computed, defineComponent, inject } from "vue";
import { Block } from "..";
import { ComponentsConfig } from "../utils/editorComponentsConfig";

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
    const componentsConfig = inject("componentsConfig") as ComponentsConfig;
    const { label, preview, render } = componentsConfig.componentMap[block.type];

    return () => (
      <div class="editor-block" style={blockStyles.value}>
        {render()}
      </div>
    );
  },
});
