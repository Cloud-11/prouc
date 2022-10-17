import { defineComponent, Ref } from "vue";
export default defineComponent({
  props: {
    line: { type: Object },
  },
  setup(props) {
    const markLine = props.line as Ref<{ x: number | null; y: number | null }>;
    return () => (
      <>
        <div
          v-show={markLine.value.x !== null}
          class="line-x"
          style={{ left: markLine.value.x + "px" }}></div>

        <div
          v-show={markLine.value.y !== null}
          class="line-y"
          style={{ top: markLine.value.y + "px" }}></div>
      </>
    );
  },
});
