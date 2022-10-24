import { computed, defineComponent, onMounted, Ref, ref, Slot, watchEffect } from "vue";
import { Block } from "..";
import { useRightMenu } from "@/hooks/useRightMenu";
import { useBlocsEvent } from "@/hooks/useBlockEvent";
import { storeToRefs } from "pinia";
import {
  useRightMenuStore,
  useJsonDataStore,
  useDomRefStore,
  useGlobalDataStore,
  useRightMenuOptsStore,
} from "@/stores";
import componentsConfig from "@/configs/components";

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

    // const { componentsConfig } = useComponentsConfigStore();
    const { render, setting } = componentsConfig.componentMap[block.type];
    let formData: any = {};
    setting.form.schema["ui:order"].forEach(key => {
      const attr = setting.form.schema.properties[key];
      let value = attr.default;
      if (!value) return;
      switch (attr.type) {
        case "number":
          value = parseFloat(value);
          break;
        case "boolean":
          value = value === "false" ? false : true;
          break;
      }
      formData[key] = value;
    });

    block.propsData = formData;
    const propsData = computed(() => block.propsData);
    let innerRender = () => {};
    if (block.type == "group") {
      //组合
      innerRender = slots.default as Slot;
    } else {
      innerRender = render(propsData);
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

    onMounted(() => {
      //block.width==0 代表拖拽进来的需要调整位置
      if (block.type !== "group" && !block.group && block.attr.width == 0) {
        const { offsetWidth, offsetHeight } = blockRef.value as HTMLElement;
        block.attr.offsetX -= offsetWidth / 2;
        block.attr.offsetY -= offsetHeight / 2;
        block.attr.width = offsetWidth;
        block.attr.height = offsetHeight;
      }
    });

    watchEffect(() => {
      const containerBox = (containerRef.value as HTMLElement)
        .offsetParent as HTMLElement;
      const containerX =
        containerBox.offsetLeft + (contentRef.value as HTMLElement).offsetLeft;
      const containerY =
        containerBox.offsetTop + (contentRef.value as HTMLElement).offsetTop;
      const { width: cw, height: ch, scale, offsetX: cx, offsetY: cy } = container.value;
      const cwS = (cw * (1 - scale)) / 2;
      const chS = (ch * (1 - scale)) / 2;
      block.attr.x = containerX + cwS + block.attr.offsetX * scale + cx;
      block.attr.y = containerY + chS + block.attr.offsetY * scale + cy;
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
