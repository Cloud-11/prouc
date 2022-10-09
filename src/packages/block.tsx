import { computed, defineComponent, inject, onMounted, Ref, ref } from "vue";
import { Block } from "..";
import { useBlockMenu } from "../hooks/useBlockEvent";
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
    const { render } = componentsConfig.componentMap[block.type];

    const blockRef: Ref<HTMLElement | null> = ref(null);
    onMounted(() => {
      const { offsetWidth, offsetHeight } = blockRef.value as HTMLElement;
      (props.block as Block).left -= offsetWidth / 2;
      (props.block as Block).top -= offsetHeight / 2;
      (props.block as Block).width = offsetWidth;
      (props.block as Block).height = offsetHeight;
    });

    //右键菜单
    return () => (
      <div
        class="editor-block"
        onContextmenu={(e: MouseEvent) => useBlockMenu(e)}
        ref={blockRef}
        style={blockStyles.value}>
        {render()}
      </div>
    );
  },
});
