import { ProucComponent, userConfig, globalData, componentsData } from "@prouc/core";
import { Block } from "@prouc/shared";
import _ from "lodash";
import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  resolveComponent,
  watch,
  watchEffect,
} from "vue";

export default defineComponent({
  props: {
    block: { type: Object },
  },
  setup(props) {
    const block = props.block as Block;
    const blockStyles = computed(() => {
      const { offsetY, offsetX, width, height, zIndex } = block.attr;
      return {
        width: width + "px",
        height: height + "px",
        top: offsetY + "px",
        left: offsetX + "px",
        zIndex: zIndex,
        position: "absolute",
      };
    });
    //获取组件配置
    const component = userConfig.componentList.get(block.type) as ProucComponent;
    //初始化组件状态数据
    const state: any = reactive(_.cloneDeep(component.state));
    // state.modelValue = null;
    //将组件数据存储
    const componentID = `${component.name}#${block.id}`;
    //组件数据默认有了，更新
    if (componentsData.has(componentID)) {
      for (const key in state) {
        componentsData.get(componentID)[key] = state[key];
      }
    }
    //卸载清除
    onUnmounted(() => {
      componentsData.delete(componentID);
    });
    //导出组件外部依赖
    let nolisten = false;
    //注入组件依赖数据 双向绑定值
    //组件props
    const propsData: Record<string, any> = {};
    let modelValueKey = "";
    //全局组件数据变化维护到组件
    watchEffect(() => {
      console.log(componentID);
      for (const key in block.propsData) {
        const attr = block.propsData[key];
        //动态props 数据源设置为组件数据或全局
        if (Array.isArray(attr) && attr) {
          if (attr[0] == "component") {
            //双向绑定数据指向组件的哪个数据
            //组件未加载时先设置数据默认null
            if (!componentsData.get(attr[1])) {
              componentsData.set(attr[1], { [attr[2]]: null });
            } else if (!Object.hasOwn(componentsData.get(attr[1]), attr[2])) {
              componentsData.get(attr[1])[attr[2]] = null;
            }

            if (key === "modelValue") {
              modelValueKey = attr[2];
              state[attr[2]] = componentsData.get(attr[1])[attr[2]];
            } else {
              propsData[key] = state[key] = componentsData.get(attr[1])[attr[2]];
            }
          } else if (attr[0] == "global") {
            //全局数据
            propsData[key] = globalData[attr[1]];
          }
        } else {
          propsData[key] = attr;
        }
      }
    });
    const inst = ref(null);
    onMounted(() => {});

    return () =>
      // @ts-ignore
      h(resolveComponent(component.name), {
        ...propsData.value,
        modelValue: modelValueKey ? state[modelValueKey] : null,
        "onUpdate:modelValue": modelValueKey
          ? (val: any) => {
              state[modelValueKey] = val;
            }
          : null,
        style: blockStyles.value,
        ref: inst,
        ...block.events,
      });
  },
});
