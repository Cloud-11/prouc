import { Ref } from "vue";
import Content from "@/components/Content";
import { useContainerEvent } from "@/hooks/useContainerEvent";
import { useDomRefStore, useGlobalDataStore, useJsonDataStore } from "@/stores";
import { storeToRefs } from "pinia";
import useContainerMaskEvent from "@/hooks/useContainerMaskEvent";
export default defineComponent({
  setup() {
    const { containerRef } = storeToRefs(useDomRefStore());
    const { container } = storeToRefs(useJsonDataStore());
    const { multipleBlock, clearFocusBlock } = useJsonDataStore();
    const { markLine } = storeToRefs(useGlobalDataStore());

    const isShowContainerMask = inject("isShowContainerMask") as Ref<boolean>;

    const { containerMouseDown, isShowSelectMask, maskArea } = useContainerEvent(
      containerRef as Ref,
      multipleBlock,
      clearFocusBlock,
      markLine
    );

    const maskStyle = computed(() => {
      const { width, height, top, left } = maskArea.value;
      return {
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      };
    });

    const containerMaskRef = ref();
    const { containerMaskMouseDown, containerMaskMousewheel } = useContainerMaskEvent(
      containerMaskRef,
      container,
      isShowContainerMask
    );

    return () => (
      <div
        ref={containerRef}
        onMousedown={e => containerMouseDown(e)}
        class="editor-container-canvas">
        <div class="mask" v-show={isShowSelectMask.value} style={maskStyle.value}></div>
        <Content></Content>
        <div
          class="editor-container-mask"
          ref={containerMaskRef}
          onWheel={e => containerMaskMousewheel(e)}
          onMousedown={e => containerMaskMouseDown(e)}
          v-show={isShowContainerMask.value}></div>
      </div>
    );
  },
});
