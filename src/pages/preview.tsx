import { useJsonDataStore } from "@/stores";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { Group } from "@/index.d";
import { reviver } from "@/utils";
import Block from "@/components/block";
import "../pages/viewContainer.scss";
export default defineComponent({
  setup() {
    const { blocks } = storeToRefs(useJsonDataStore());
    const data = JSON.parse(localStorage.getItem("blocks") || "", reviver);
    blocks.value = data;
    return () => (
      <div class="previewContainer">
        {Array.from(blocks.value.values()).map(block => {
          return block.type == "group" ? (
            <Block key={block.id} block={block}>
              {(block as Group).blocks.map(block => (
                <Block block={block}></Block>
              ))}
            </Block>
          ) : (
            <Block key={block.id} block={block}></Block>
          );
        })}
      </div>
    );
  },
});
