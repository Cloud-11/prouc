import { defineComponent, onMounted, ref, toRefs } from "vue";
import RenderBlock from "./components/block";
import { DATA_JSON, Group } from "@prouc/shared";
import "./viewContainer.scss";

export default defineComponent({
  props: {
    blocks: { type: Object },
  },
  setup(props) {
    const { blocks } = toRefs(props);
    return () => (
      <div class="ProucViewContainer">
        {blocks.value
          ? Array.from((blocks.value as DATA_JSON["blocks"]).values()).map(block => {
              return <RenderBlock key={block.id} block={block}></RenderBlock>;
            })
          : ""}
      </div>
    );
  },
});
