import { Ref } from "vue";
import { AnyObject, Block, BlockEventAction } from "@prouc/shared";
import { useJsonDataStore } from "@/stores";
import { storeToRefs } from "pinia";
import { Component, ComponentEvent, ComponentMethod, userConfig } from "@prouc/core";
import { Rule, Options } from "@form-create/element-ui";
import _ from "lodash";
import { FormInstance, FormRules } from "element-plus";
import { ComponentSize } from "@form-create/element-ui/types/config";

export default defineComponent({
  setup: function () {
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
      schema: { rule: Rule[]; options: Options };
      formData: AnyObject;
      methods: AnyObject<ComponentMethod | any>;
      events: AnyObject<ComponentEvent | any>;
      block: Block | null;
    }

    const baseOptions = {
      form: {
        labelPosition: "left",
        size: "default" as ComponentSize,
        labelWidth: "125px",
        hideRequiredAsterisk: true,
        showMessage: true,
        inlineMessage: false,
      },
      submitBtn: false,
      // resetBtn: false,
    };
    const canvasForm = {
      rule: [
        {
          type: "inputNumber",
          field: "width",
          title: "宽度",
          info: "",
          _fc_drag_tag: "inputNumber",
          hidden: false,
          display: true,
          validate: [
            {
              trigger: "change",
              mode: "required",
              message: "",
              required: true,
              type: "number",
            },
          ],
        },
        {
          type: "inputNumber",
          field: "height",
          title: "高度",
          info: "",
          _fc_drag_tag: "inputNumber",
          hidden: false,
          display: true,
          validate: [
            {
              trigger: "change",
              mode: "required",
              message: "",
              required: true,
              type: "number",
            },
          ],
        },
      ],
      options: baseOptions,
    };
    const state: State = reactive({
      tabActive: "attr",
      schema: canvasForm,
      formData: {},
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
        const component = userConfig.componentList.get(state.block.type);
        if (component) {
          state.block.events.map(({ name, trigger, actions }) => {
            actions.forEach(action => {
              events.push({
                name,
                trigger: component.setting.events[trigger].label,
                component: action.blockName + "#" + action.blockID,
                action: component.setting.methods[action.method].label,
              });
            });
          });
        }
      }
      return events;
    });

    //获取全部组件动作
    const getAllMethod = () => {
      state.blockMethos = [];
      blocks.value.forEach(block => {
        const component = userConfig.componentList.get((state.block as Block).type);
        if (!component) return;
        const { label, setting } = component;
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
                    const component = userConfig.componentList.get(ids[0]) as Component;
                    return {
                      blockID: ids[1],
                      blockName: component.label,
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
    let listen = true;
    const init = () => {
      state.schema = canvasForm;
      listen = false;
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
        if (!listen) {
          listen = true;
        }
        if (_.isEmpty(state.formData)) return;
        if (state.block !== null) {
          const b = _.cloneDeep(state.block);
          b.propsData = _.cloneDeep(state.formData);
          console.log(b.propsData);
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
          state.block = _.cloneDeep(focusAndBlocks.value.lastFocusBlock);
          listen = false;
          state.formData = _.cloneDeep(state.block.propsData);
          const { label, setting } = userConfig.componentList.get(
            state.block.type
          ) as Component;
          const { rule, options } = setting.form;
          const title = {
            type: "span",
            title: `${label}#${state.block.id}属性配置`,
            native: false,
            children: [""],
            _fc_drag_tag: "span",
            hidden: false,
            display: true,
          };
          state.methods = setting.methods;
          state.events = setting.events;
          state.schema = {
            rule: [title, ...rule],
            options: _.merge(baseOptions, options),
          };
        } else {
          init();
        }
      }
    );

    return () => (
      <div class="editor-component-setting">
        <el-tabs v-model={state.tabActive}>
          <el-tab-pane label="属性" name="attr">
            <form-create
              v-model={state.formData}
              rule={state.schema.rule}
              option={state.schema.options}></form-create>
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
