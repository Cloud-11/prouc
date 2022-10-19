import { computed, defineComponent, onMounted, Ref, ref, Slot, watchEffect } from "vue";
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
    const { focusAndBlocks, container } = storeToRefs(JsonDataStore);
    const { contentRef, containerRef } = storeToRefs(useDomRefStore());
    const globalDataStore = useGlobalDataStore();
    const { markLine } = storeToRefs(globalDataStore);
    // let blockStyles = computed(() => {
    //   const { offsetY, offsetX, zIndex } = block.attr;
    //   return {
    //     top: offsetY + "px",
    //     left: offsetX + "px",
    //     zIndex: zIndex,
    //   };
    // });
    const blockStyles = computed(() => {
      const { offsetY, offsetX, width, height, zIndex } = block.attr;
      const blockstyle = {
        top: offsetY + "px",
        left: offsetX + "px",
        zIndex: zIndex,
      };
      return width === 0 && height === 0
        ? blockstyle
        : {
            ...blockstyle,
            width: width + "px",
            height: height + "px",
          };
    });

    const { componentsConfig } = useComponentsConfigStore();
    let innerRender = () => {};
    if (block.type == "group") {
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
      container,
      focusAndBlocks,
      clearFocusBlock,
      modifyBlock,
      hiddenRightMenu,
      recordOpts,
      markLine,
      contentRef as Ref<HTMLElement>
    );

    //渲染完成更新大小位置
    const blockRef: Ref<HTMLElement | null> = ref(null);
    const containerBox = (containerRef.value as HTMLElement).offsetParent as HTMLElement;
    const containerX =
      containerBox.offsetLeft + (contentRef.value as HTMLElement).offsetLeft;
    const containerY =
      containerBox.offsetTop + (contentRef.value as HTMLElement).offsetTop;
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

    watchEffect(() => {
      (props.block as Block).attr.x = containerX + (props.block as Block).attr.offsetX;
      (props.block as Block).attr.y = containerY + (props.block as Block).attr.offsetY;
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
