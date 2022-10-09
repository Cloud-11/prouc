import { computed, defineComponent, onMounted, Ref, ref } from "vue";
import { Block } from "..";
import { useRightMenu } from "@/hooks/useRightMenu";
import { useBlocsEvent } from "@/hooks/useBlockEvent";
import { storeToRefs } from "pinia";
import {
  useComponentsConfigStore,
  useRightMenuStore,
  useJsonDataStore,
  useDomRefStore,
  useGlobalDataStore,
} from "@/stores";
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
    const { componentsConfig } = useComponentsConfigStore();
    const { render } = componentsConfig.componentMap[block.type];

    //显示右键菜单
    const { showsMenu, setMenuPos, hiddenMenu } = useRightMenuStore();
    const { showRightMenu, hiddenRightMenu } = useRightMenu(
      showsMenu,
      setMenuPos,
      hiddenMenu
    );

    const JsonDataStore = useJsonDataStore();
    const { JsonData } = storeToRefs(JsonDataStore);
    const DomRefStore = useDomRefStore();
    const contentRef = storeToRefs(DomRefStore).contentRef as Ref<HTMLElement>;
    const globalDataStore = useGlobalDataStore();
    const { markLine } = storeToRefs(globalDataStore);
    //渲染组件选择、拖拽
    const { blockMousedown } = useBlocsEvent(JsonData, markLine);

    //渲染完成更新大小位置
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
        onMousedown={(e: MouseEvent) =>
          blockMousedown(e, block, hiddenRightMenu, contentRef)
        }
        onContextmenu={(e: MouseEvent) => showRightMenu(e)}
        ref={blockRef}
        style={blockStyles.value}>
        {render()}
      </div>
    );
  },
});
