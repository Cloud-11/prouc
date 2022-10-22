import { useJsonDataStore } from "@/stores";
import { storeToRefs } from "pinia";
import { computed, defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const { container } = storeToRefs(useJsonDataStore());

    const marks = reactive({
      1: {},
    });

    const scaleRange = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5];
    const scaleOptions = [0.5, 0.8, 1, 1.2, 1.5];
    return () => (
      <div class="editor-container-toolsbar">
        <div class="history"></div>
        <span>画布缩放</span>
        <el-select v-model={container.value.scale} class="select" placeholder="Select">
          {scaleRange.map(option => (
            <el-option
              v-show={scaleOptions.includes(option)}
              key={option}
              label={Math.floor(option * 100) + "%"}
              value={option}
            />
          ))}
        </el-select>
        <div class="sacle-slider">
          <el-slider
            v-model={container.value.scale}
            size="small"
            min={0.3}
            max={1.5}
            step={0.1}
            marks={marks}
            format-tooltip={(value: number) => Math.floor(value * 100) + "%"}
          />
        </div>
      </div>
    );
  },
});
