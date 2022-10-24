import { defineComponent, ref, watch, watchEffect } from "vue";
import { useJsonDataStore } from "@/stores";
import { storeToRefs } from "pinia";
import componentsConfig from "@/configs/components";
import _ from "lodash";
import { Block } from "..";

export default defineComponent({
  setup() {
    const jsonDataStore = useJsonDataStore();
    const { modifyBlock } = jsonDataStore;
    const { focusAndBlocks, container } = storeToRefs(jsonDataStore);
    const tabActive = ref("attr");

    let schema = ref(),
      formProps = ref({ labelPosition: "left", labelSuffix: "：" }),
      formFooter = ref({
        show: false,
      }),
      uiSchema = ref({}),
      formData = ref(),
      block: Block | null = null;
    const init = () => {
      schema.value = {
        title: "画布配置",
        type: "object",
        required: [],
        properties: {
          width: {
            title: "宽度",
            type: "number",
            multipleOf: 1,
          },
          height: {
            title: "高度",
            type: "number",
            multipleOf: 1,
          },
        },
        "ui:order": ["width", "height"],
      };
      uiSchema.value = {};
      formFooter.value = { show: false };
      formData.value = {
        height: container.value.height,
        width: container.value.width,
      };
      block = null;
    };
    init();
    watchEffect(() => {
      if (_.isEmpty(formData.value)) return;
      if (block !== null) {
        const b = _.cloneDeep(block);
        b.propsData = formData.value;
        modifyBlock(b.id, "propsData", b);
      } else {
        container.value.height = formData.value.height;
        container.value.width = formData.value.width;
      }
    });

    watch(
      () => focusAndBlocks.value.focusBlocks,
      () => {
        if (focusAndBlocks.value.focusBlocks.length == 1) {
          block = focusAndBlocks.value.lastFocusBlock;
          formData.value = block.propsData;
          const { schema: fschema, uiSchema } =
            componentsConfig.componentMap[block.type].setting.form;
          schema.value = fschema;
          uiSchema.value = uiSchema;
        } else {
          init();
        }
      }
    );

    return () => (
      <div class="editor-component-setting">
        <el-tabs v-model={tabActive.value}>
          <el-tab-pane label="属性" name="attr">
            <vue-form
              v-model={formData.value}
              form-props={formProps.value}
              form-footer={formFooter.value}
              ui-schema={uiSchema.value}
              schema={schema.value}></vue-form>
          </el-tab-pane>
          <el-tab-pane label="动作" name="active">
            动作
          </el-tab-pane>
          <el-tab-pane label="事件" name="event">
            事件
          </el-tab-pane>
        </el-tabs>
      </div>
    );
  },
});
