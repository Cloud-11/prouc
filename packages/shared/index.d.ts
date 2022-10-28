export interface DATA_JSON {
  container: Container;
  blocks: Map<number, Block | Group>;
}
export interface Container {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}
export interface BlockAttr {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  zIndex: number;
}
export interface BlockStatus {
  lock: boolean;
  focus: boolean;
}
export interface Group extends Block {
  blocks: Block[];
}
export type BlockStringKey = "type" | "id" | "group" | "attr" | "status";
export type BlockAttrStringKey =
  | "x"
  | "y"
  | "offsetX"
  | "offsetY"
  | "width"
  | "height"
  | "zIndex";
type BlockValueType = string | number | boolean | BlockAttr | BlockStatus;
export interface Block {
  type: string;
  id: number;
  group: boolean;
  attr: BlockAttr;
  status: BlockStatus;
  propsData: BlockPropsData; //组件需要传递的props 组件配置选项
  state?: any; //组件内部数据
  events: BlockEvent[]; //组件事件 组件触发==>动作(方法[参数=>数据源])
  methods?: any; //组件对外暴露的方法
}
export interface BlockEvent {
  id: string; //事件ID 组件TYPE#组件ID_随机数字
  name: string; //事件名称
  trigger: string; //触发方法
  actions: BlockEventAction[];
}
export interface BlockEventAction {
  blockID: string; //组件id
  blockName: string; //组件名
  method: string; //组件方法名
}
export interface BlockPropsData {
  [key: string]: any;
}
export interface MaskArea {
  width: number;
  height: number;
  top: number;
  left: number;
}
export interface AnyObject<T = any> {
  [key: string]: T;
}
