export interface DATA_JSON {
  container: Container;
  blocks: Map<number, Block | Group>;
}
export interface Container {
  width: string;
  height: number;
}
export type BlockAttr =
  | "type"
  | "group"
  | "top"
  | "left"
  | "width"
  | "height"
  | "zIndex"
  | "focus";
export interface BlockPatch {
  key: BlockAttr;
  value: string | number | boolean;
}
export interface Group extends Block {
  blocks: Block[];
}
export interface Block {
  type: string;
  id: number;
  group: boolean;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  focus: boolean;
}
export interface MaskArea {
  width: number;
  height: number;
  top: number;
  left: number;
}
