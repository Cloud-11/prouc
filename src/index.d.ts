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
export type BlockValueType = string | number | boolean | BlockAttr | BlockStatus;
export interface Block {
  type: string;
  id: number;
  group: boolean;
  attr: BlockAttr;
  status: BlockStatus;
}
export interface MaskArea {
  width: number;
  height: number;
  top: number;
  left: number;
}
