export interface DATA_JSON {
  container: {
    width: number;
    height: number;
  };
  blocks: Block[];
}

export interface Block {
  type: string;
  top: number;
  left: number;
  zIndex: number;
}
