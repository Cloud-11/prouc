import { defineComponent, effect, reactive } from "vue";
import { AllApplication, TableFile, Box, Play } from "@icon-park/vue-next";
export default defineComponent({
  props: ["modelValue"],
  emits: ["update:modelValue"],
  components: {
    AllApplication,
    TableFile,
    Box,
    Play,
  },
  setup(props, { emit }) {
    const modelValue = props.modelValue;
    const state = reactive({
      classArr: [
        {
          name: "basic",
          desc: "基础组件",
          active: true,
          icon: () => <all-application theme="outline" size="16" fill="#1890ff" />,
        },
        {
          name: "form",
          desc: "表单组件",
          active: false,
          icon: () => <table-file theme="outline" size="24" fill="#1890ff" />,
        },
        {
          name: "container",
          desc: "容器组件",
          active: false,
          icon: () => <box theme="outline" size="24" fill="#1890ff" />,
        },
        {
          name: "media",
          desc: "媒体组件",
          active: false,
          icon: () => <play theme="outline" size="24" fill="#1890ff" />,
        },
      ],
    });
    effect(() => {
      state.classArr.forEach(val => {
        val.name === modelValue ? (val.active = true) : (val.active = false);
      });
    });
    return () => (
      <div class="editor-components-class">
        {state.classArr.map(item => (
          <div
            class={`editor-components-class-item ${item.active ? "selected" : ""}`}
            onClick={() => {
              emit("update:modelValue", item.name);
              state.classArr.forEach(val => {
                val.name === item.name ? (val.active = true) : (val.active = false);
              });
            }}>
            <span>{item.icon()}</span>
            <span>{item.desc}</span>
          </div>
        ))}
      </div>
    );
  },
});
