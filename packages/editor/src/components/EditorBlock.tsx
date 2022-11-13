import { computed, defineComponent, onMounted, Ref, ref, watchEffect } from "vue";
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
import { ProucComponent, globalData, componentsData, userConfig } from "@prouc/core";
import { Block, Group } from "@prouc/shared";
import _ from "lodash";

const EditorBlock = defineComponent({
  props: {
    block: { type: Object },
  },
  setup(props) {
    const block = props.block as Block;
    const JsonDataStore = useJsonDataStore();
    const { modifyBlock, clearFocusBlock, recordOpts } = JsonDataStore;
    const { focusAndBlocks, container } = storeToRefs(JsonDataStore);
    const { contentRef, containerRef } = storeToRefs(useDomRefStore());
    const globalDataStore = useGlobalDataStore();
    const { markLine } = storeToRefs(globalDataStore);

    const blockStyles = computed(() => {
      const { offsetY, offsetX, width, height, zIndex } = block.attr;
      const blockStyle = {
        top: offsetY + "px",
        left: offsetX + "px",
        zIndex: zIndex,
      };
      return width === 0 && height === 0
        ? blockStyle
        : {
            ...blockStyle,
            width: width + "px",
            height: height + "px",
          };
    });

    const component = userConfig.componentList.get(block.type) as ProucComponent;
    block.propsData = _.cloneDeep(component.initProps);
    block.events = [];
    block.methods = [];
    const state: any = reactive(_.cloneDeep(component.state));
    //将组件数据存储
    const componentID = `${component.name}#${block.id}`;
    if (componentsData.has(componentID)) {
      componentsData.delete(componentID);
    }
    componentsData.set(componentID, state);
    //组件props
    const propsData = computed(() => {
      // console.log(block.propsData);
      const props: Record<string, any> = {};
      for (const key in block.propsData) {
        const attr = block.propsData[key];
        //动态props 数据源设置为组件数据或全局
        if (Array.isArray(attr) && attr) {
          if (attr[0][0] == "component") {
            //组件数据 自己的或其他组件的
            props[key] = componentsData.get(attr[0][1])[attr[0][2]] || "";
          } else if (attr[0][0] == "global") {
            //全局数据
            props[key] = globalData[attr[0][1]];
          }
        } else {
          props[key] = attr;
        }
      }
      return props;
    });

    const blockSolts: any = (block: Group) =>
      block.blocks.map((block: Group | Block) =>
        h(EditorBlock, {
          key: block.id,
          block,
          class: block.status.focus ? "editor-block-focus" : "",
        })
      );

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
    const render = () =>
      h(
        resolveComponent(component.name),
        { ...propsData.value, modelValue: state.modelValue, event: block.events },
        (block as Group).blocks ? blockSolts(block as Group) : component?.slots?.default
      );

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
        {render()}
      </div>
    );
  },
});
export default EditorBlock;
