import { h, resolveComponent, VNode } from "vue";
import { Rule, Options } from "@form-create/element-ui";

export interface ComponentEvent {
  label: string;
  desc: string;
  name: string;
  args?: { name: string; type: string }[] | [];
}
export interface ComponentMethod {
  label: string;
  desc: string;
  name: string;
}
export interface FormJsonSchema {
  rule: Rule[];
  options: Options;
}

export class ProucComponent {
  readonly label: string;
  readonly name: string;
  readonly type: string;
  readonly events: Record<string, ComponentEvent>;
  readonly methods: Record<string, ComponentMethod>;
  form: FormJsonSchema;
  readonly state: Record<string | number | symbol, any>;
  readonly initProps: Record<string | number | symbol, any>;
  readonly slots?: Record<string, () => VNode | string>;
  constructor(options: {
    name: string;
    label: string;
    type: string;
    initProps: Record<string | number | symbol, any>;
    events: Record<string, ComponentEvent>;
    methods: Record<string, ComponentMethod>;
    form: FormJsonSchema;
    state: Record<string | number | symbol, any>;
    slots?: Record<string, () => VNode | string>;
  }) {
    this.label = options.label;
    this.name = options.name;
    this.type = options.type;
    this.initProps = options.initProps;
    this.events = options.events;
    this.methods = options.methods;
    this.form = options.form;
    this.state = options.state;
    this.slots = options.slots;
  }
}

/*
  组件全局数据管理
    组件数据暴露 -> 动态加入数据源 -> 组件数据关联


 */
