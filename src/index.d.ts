export interface DATA_JSON {
  container: Container;
  blocks: Block[];
}
export interface Container {
  width: string;
  height: number;
}
export type BlockAttr = "type" | "top" | "left" | "width" | "height" | "zIndex" | "focus";
export interface BlockPatch {
  key: BlockAttr;
  value: string | number | boolean;
}
export interface Block {
  type: string;
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
