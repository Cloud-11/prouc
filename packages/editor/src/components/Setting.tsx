import { Ref } from "vue";
import { AnyObject, Block, BlockEventAction } from "@prouc/shared";
import { useJsonDataStore } from "@/stores";
import { storeToRefs } from "pinia";
import componentsConfig, {
  ComponentEvent,
  ComponentMethod,
  JsonSchema,
} from "@prouc/components";
import VueForm from "@lljj/vue3-form-element";
import _ from "lodash";
import { FormInstance, FormRules } from "element-plus";

export default defineComponent({
  components: {
    VueForm,
  },
  setup() {
    const jsonDataStore = useJsonDataStore();
    const { modifyBlock } = jsonDataStore;
    const { focusAndBlocks, container, blocks } = storeToRefs(jsonDataStore);
    interface CascaderOption {
      value: string;
      label: string;
    }
    interface CascaderOptions extends CascaderOption {
      children: CascaderOption[];
    }
    interface State {
      blockMethos: CascaderOptions[];
      addEventForm: {
        name: string;
        trigger: string;
        actions: string[][];
      };
      eventDialog: any;
      tabActive: string;
      schema: JsonSchema;
      uiSchema: AnyObject;
      formData: AnyObject;
      formProps: AnyObject;
      formFooter: AnyObject;
      methods: AnyObject<ComponentMethod | any>;
      events: AnyObject<ComponentEvent | any>;
      block: Block | null;
    }
    const state: State = reactive({
      tabActive: "attr",
      schema: {
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
      },
      formProps: {
        show: false,
      },
      uiSchema: {},
      formData: {},
      formFooter: { show: false },
      methods: [],
      events: [],
      block: null,
      eventDialog: false,
      addEventForm: { name: "", trigger: "", actions: [] },
      blockMethos: [],
    });

    const blockEevnts = computed(() => {
      const events: {
        name: string;
        trigger: string;
        component: string;
        action: string;
      }[] = [];
      if (state.block) {
        const { setting } = componentsConfig.componentMap[(state.block as Block).type];
        state.block.events.map(({ name, trigger, actions }) => {
          actions.forEach(action => {
            events.push({
              name,
              trigger: setting.events[trigger].label,
              component: action.blockName + "#" + action.blockID,
              action: setting.methods[action.method].label,
            });
          });
        });
      }
      return events;
    });

    //获取全部组件动作
    const getAllMethod = () => {
      state.blockMethos = [];
      blocks.value.forEach(block => {
        const { setting, label } = componentsConfig.componentMap[block.type];
        if (Object.keys(setting.methods).length < 1) return;
        state.blockMethos.push({
          label: `${label}#${block.id}`,
          value: `${block.type}#${block.id}`,
          children: (() => {
            const arr: CascaderOption[] = [];
            Object.keys(setting.methods).forEach(key => {
              const method = setting.methods[key];
              arr.push({
                label: method.label,
                value: method.action,
              });
            });
            return arr;
          })(),
        });
      });
    };

    const rules = reactive<FormRules>({
      name: [
        {
          required: true,
          message: "名称必须输入",
          trigger: "blur",
        },
      ],
      trigger: [
        {
          required: true,
          message: "触发项必须输入",
          trigger: "blur",
        },
      ],
      actions: [
        {
          required: true,
          message: "执行动作必须输入",
          trigger: "blur",
        },
      ],
    });
    const eventDialogFormRef: Ref<FormInstance | null> = ref(null);
    //添加事件提交
    const submitForm = async () => {
      if (eventDialogFormRef.value !== null) {
        //校验表单
        await eventDialogFormRef.value.validate(valid => {
          if (valid) {
            if (state.block !== null) {
              try {
                const b = _.cloneDeep(state.block);
                const eventID = `${b.type}#${b.id}_Event:${
                  b.events.length > 0 ? b.events?.length + 1 : 1
                }`;
                //组装数据
                const actions: BlockEventAction[] = state.addEventForm.actions.map(
                  action => {
                    const ids = action[0].split("#");
                    return {
                      blockID: ids[1],
                      blockName: componentsConfig.componentMap[ids[0]].label,
                      method: action[1],
                    };
                  }
                );
                b.events.push({ ...state.addEventForm, id: eventID, actions });
                modifyBlock(b.id, "events", b);
              } catch (e) {
                console.error(e);
              }
            }
            state.eventDialog = false;
          }
        });
      }
    };

    const resetForm = () => {
      if (!eventDialogFormRef.value) return;
      eventDialogFormRef.value.resetFields();
      state.eventDialog = false;
    };
    const init = () => {
      state.schema = {
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
      state.uiSchema = {};
      state.formFooter = { show: false };
      state.formData = {
        height: container.value.height,
        width: container.value.width,
      };
      state.block = null;
    };
    init();
    watch(
      () => state.formData,
      () => {
        if (_.isEmpty(state.formData)) return;
        if (state.block !== null) {
          const b = _.cloneDeep(state.block);
          b.propsData = state.formData;
          modifyBlock(b.id, "propsData", b);
        } else {
          container.value.height = state.formData.height;
          container.value.width = state.formData.width;
        }
      }
    );

    watch(
      () => focusAndBlocks.value.focusBlocks,
      () => {
        if (focusAndBlocks.value.focusBlocks.length == 1) {
          state.block = focusAndBlocks.value.lastFocusBlock;
          state.formData = state.block.propsData;
          const { label, setting } = componentsConfig.componentMap[state.block.type];
          const { schema: fschema, uiSchema } = setting.form;
          state.methods = setting.methods;
          state.events = setting.events;
          state.schema = { ...fschema, title: label + "#" + state.block.id };
          state.uiSchema = uiSchema;
        } else {
          init();
        }
      }
    );

    return () => (
      <div class="editor-component-setting">
        <el-tabs v-model={state.tabActive}>
          <el-tab-pane label="属性" name="attr">
            <vue-form
              v-model={state.formData}
              form-props={state.formProps}
              form-footer={state.formFooter}
              ui-schema={state.uiSchema}
              schema={state.schema}></vue-form>
          </el-tab-pane>
          <el-tab-pane label="样式" name="style"></el-tab-pane>
          <el-tab-pane label="数据源" name="state">
            组件内部数据源
          </el-tab-pane>
          <el-tab-pane label="事件" name="event">
            <el-button
              type="primary"
              onClick={() => {
                state.eventDialog = true;
                getAllMethod();
              }}>
              添加事件
            </el-button>
            <el-table
              data={blockEevnts.value}
              style={{ width: "100%" }}
              summary-method={({ columns, data }: any) => {
                console.log(columns);
                console.log(data);
              }}>
              <el-table-column prop="name" min-width={150} label="事件名称" />
              <el-table-column prop="trigger" min-width={150} label="触发条件" />
              <el-table-column prop="component" min-width={150} label="触发组件" />
              <el-table-column prop="action" min-width={150} label="触发动作" />
            </el-table>
            <el-dialog
              v-model={state.eventDialog}
              title="添加事件"
              width="700px"
              before-close={(done: Function) => {
                state.addEventForm = { name: "", trigger: "", actions: [] };
                done();
              }}>
              <el-form
                ref={eventDialogFormRef}
                model={state.addEventForm}
                label-width="auto"
                rules={rules}>
                <el-form-item label="事件名称" prop="name">
                  <el-input
                    input-style={{ width: "400px" }}
                    v-model={state.addEventForm.name}
                  />
                </el-form-item>
                <el-form-item label="事件触发时机" prop="trigger">
                  <el-select
                    style={{ width: "422px" }}
                    v-model={state.addEventForm.trigger}
                    placeholder="请选择事件的触发时机">
                    {Object.keys(state.events).map(key => {
                      const event = state.events[key];
                      return <el-option label={event.label} value={event.event} />;
                    })}
                  </el-select>
                </el-form-item>
                <el-form-item label="执行动作" prop="actions">
                  <el-cascader
                    style={{ width: "422px" }}
                    v-model={state.addEventForm.actions}
                    options={state.blockMethos}
                    props={{ multiple: true }}
                  />
                </el-form-item>
                <el-form-item style={{ margin: "20px 0 18px 106px" }}>
                  <el-button onClick={resetForm}>取消</el-button>
                  <el-button
                    style={{ marginLeft: "20px" }}
                    type="primary"
                    onClick={submitForm}>
                    确定
                  </el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
      </div>
    );
  },
});
