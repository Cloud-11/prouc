import { computed, defineComponent, onMounted, Ref, ref, Slot } from "vue";
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
  useRightMenuOptsStore,
} from "@/stores";
const EditorBlock = defineComponent({
  props: {
    block: { type: Object },
  },
  setup(props, { slots }) {
    const block = props.block as Block;
    const JsonDataStore = useJsonDataStore();
    const { modifyBlock, clearFocusBlock, recordOpts } = JsonDataStore;
    const { focusAndBlocks } = storeToRefs(JsonDataStore);
    const DomRefStore = useDomRefStore();
    const contentRef = storeToRefs(DomRefStore).contentRef as Ref<HTMLElement>;
    const globalDataStore = useGlobalDataStore();
    const { markLine } = storeToRefs(globalDataStore);
    let blockStyles = computed(() => {
      return {
        top: block.attr.offsetY + "px",
        left: block.attr.offsetX + "px",
        zIndex: block.attr.zIndex,
      };
    });
    const { componentsConfig } = useComponentsConfigStore();
    let innerRender = () => {};
    if (block.type == "group") {
      blockStyles = computed(() => ({
        top: block.attr.offsetY + "px",
        left: block.attr.offsetX + "px",
        width: block.attr.width + "px",
        height: block.attr.height + "px",
        zIndex: block.attr.zIndex,
      }));
      //组合
      innerRender = slots.default as Slot;
    } else {
      innerRender = componentsConfig.componentMap[block.type].render;
    }

    //显示右键菜单
    const { showsMenu, setMenuPos, hiddenMenu } = useRightMenuStore();
    const { setMenus } = useRightMenuOptsStore();
    const { showRightMenu, hiddenRightMenu } = useRightMenu(
      showsMenu,
      setMenuPos,
      hiddenMenu,
      setMenus
    );

    //渲染组件选择、拖拽
    const { blockMousedown } = useBlocsEvent(
      focusAndBlocks,
      clearFocusBlock,
      modifyBlock,
      hiddenRightMenu,
      recordOpts,
      markLine,
      contentRef
    );

    //渲染完成更新大小位置
    const blockRef: Ref<HTMLElement | null> = ref(null);
    onMounted(() => {
      //(props.block as Block).width==0 代表拖拽进来的需要调整位置
      if (
        block.type !== "group" &&
        !block.group &&
        (props.block as Block).attr.width == 0
      ) {
        const { offsetWidth, offsetHeight } = blockRef.value as HTMLElement;
        (props.block as Block).attr.offsetX -= offsetWidth / 2;
        (props.block as Block).attr.offsetY -= offsetHeight / 2;
        (props.block as Block).attr.width = offsetWidth;
        (props.block as Block).attr.height = offsetHeight;
      }
    });

    //右键菜单
    return () => (
      <div
        class="editor-block"
        onMousedown={
          block.group ? undefined : (e: MouseEvent) => blockMousedown(e, block)
        }
        onContextmenu={
          block.group
            ? undefined
            : (e: MouseEvent) =>
                showRightMenu(e, block.type == "group" ? "groupMenus" : "blockMenus")
        }
        ref={blockRef}
        style={blockStyles.value}>
        {innerRender()}
      </div>
    );
  },
});
export default EditorBlock;
