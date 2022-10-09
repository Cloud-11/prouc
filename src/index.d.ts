export interface DATA_JSON {
  container: {
    width: string;
    height: number;
  };
  blocks: Block[];
}

export interface Block {
  type: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  focus?: boolean;
}
