import { Category } from "@prouc/core";

export default defineComponent({
  props: {
    categoryList: { type: Object },
    modelValue: { type: String },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const categoryList = props.categoryList as Category[];
    const clickHandler = (category: Category) => {
      categoryList.forEach(item => {
        if (item.name === category.name) {
          item.active = true;
          emit("update:modelValue", category.name);
        } else {
          item.active = false;
        }
      });
    };
    return () => (
      <div class="editor-components-class">
        {categoryList.map(category => (
          <div
            class={`editor-components-class-item ${category.active ? "selected" : ""}`}
            onClick={() => clickHandler(category)}>
            <span>{category.icon()}</span>
            <span>{category.desc}</span>
          </div>
        ))}
      </div>
    );
  },
});
