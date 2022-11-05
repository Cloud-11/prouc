import { h, resolveComponent } from "vue";
import { AnyObject } from "@prouc/shared";
import { Rule, Options } from "@form-create/element-ui";

export interface ComponentEvent {
  label: string;
  desc: string;
  event: string;
  args: { name: string; type: string }[] | [];
}
export interface ComponentMethod {
  label: string;
  desc: string;
  action: string;
}
export interface FormJsonSchema {
  rule: Rule[];
  options: Options;
  initData: AnyObject;
}

export class Component {
  public label: string;
  public name: string;
  public type: string;
  public setting: {
    events: AnyObject<ComponentEvent | any>;
    methods: AnyObject<ComponentMethod | any>;
    form: FormJsonSchema;
  };
  constructor(options: {
    name: string;
    label: string;
    type: string;
    setting: {
      events: AnyObject<ComponentEvent | any>;
      methods: AnyObject<ComponentMethod | any>;
      form: FormJsonSchema;
    };
  }) {
    this.label = options.label;
    this.name = options.name;
    this.type = options.type;
    this.setting = options.setting;
  }
  showRender() {
    const name = this.name;
    // @ts-ignore
    return h(resolveComponent(name), null, { default: () => this.label });
  }
  render(props: any, state?: any, events?: any, slots?: any) {
    const name = this.name;
    return h(
      // @ts-ignore
      resolveComponent(name),
      {
        modelValue: state.modelValue || this.label,
        ...props,
      },
      { default: () => this.label }
    );
  }
}
