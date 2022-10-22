import { defineComponent, effect, Ref, ref, watch, watchEffect } from "vue";
import { useJsonDataStore, useComponentsConfigStore } from "@/stores";
import { storeToRefs } from "pinia";
import { JsonSchema } from "@/configs/editorComponentsConfig";
import _ from "lodash";
import { Block } from "..";

export default defineComponent({
  setup() {
    const jsonDataStore = useJsonDataStore();
    const { modifyBlock } = jsonDataStore;
    const { focusAndBlocks, container } = storeToRefs(jsonDataStore);
    const { componentsConfig } = useComponentsConfigStore();
    //labelWidth: "100px",
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
      // formProps.value = { labelPosition: "left", labelWidth: "300px", labelSuffix: "：" };
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
        b.formData = formData.value;
        modifyBlock(b.id, "formData", b);
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
          formData.value = {};
          if (Object.keys(block.formData).length == 0) {
            (schema.value as JsonSchema)["ui:order"].forEach(key => {
              const attr = (schema.value as JsonSchema).properties[key];
              if (!attr.default) return;
              let value = attr.value;
              switch (attr.type) {
                case "number":
                  value = parseFloat(value);
                  break;
                case "boolean":
                  value = value === "false" ? false : true;
                  break;
              }
              formData.value[key] = value;
            });
          } else {
            formData.value = block.formData;
          }
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
        <vue-form
          // key={formkey}
          v-model={formData.value}
          form-props={formProps.value}
          form-footer={formFooter.value}
          ui-schema={uiSchema.value}
          schema={schema.value}></vue-form>
      </div>
    );
  },
});
