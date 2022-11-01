import { defineStore, storeToRefs } from "pinia";
import { computed, reactive, Ref, toRefs } from "vue";

import data from "../data.json";
import { collide } from "@/utils";
import _ from "lodash";
import { useDomRefStore } from "./domRef";
import {
  Block,
  BlockStringKey,
  BlockValueType,
  DATA_JSON,
  Group,
  MaskArea,
} from "@prouc/shared";

export interface Record {
  currentOpt: number;
  operations: Operations[];
}
export interface Operations {
  opera: RecordOpts;
  blocks: Map<number, Block | Group>;
}
//需要记录的操作
export enum RecordOpts {
  INIT, //初始化
  ADD, //新增
  MOVE, //移动
  DEL, //删除
  LAYOUT, //调整宽高
  LEVEL, //调整层级\
  GROUP, //组合
  UNGROUP,
  COPY,
}

export const useJsonDataStore = defineStore("JsonData", () => {
  const JsonData: DATA_JSON = reactive({ ...data, blocks: new Map<number, Block>() });
  const { container, blocks } = toRefs(JsonData);
  //操作记录
  const records: Record = {
    currentOpt: 0,
    operations: [{ opera: RecordOpts.INIT, blocks: new Map<number, Block>() }],
  };
  //记录操作
  function recordOpts(opera: RecordOpts, tag?: string) {
    const len = records.operations.length;
    //最多记录50条
    if (len >= 50) {
      records.operations.shift();
    }
    //移动最终判断 未移动 移除记录
    if (opera == RecordOpts.MOVE && tag == "unmove") {
      records.operations.pop();
      records.currentOpt = records.operations.length - 1;
      return;
    }

    //组合的删除 添加操作 合并
    //取消组合的添加 删除操作合并
    let groupBefore = null;
    if (
      ((opera == RecordOpts.ADD && tag == "group") ||
        (opera == RecordOpts.DEL && tag == "ungroup") ||
        (opera == RecordOpts.ADD && tag == "copyOver")) &&
      records.currentOpt < len - 1
    ) {
      groupBefore = records.operations[records.currentOpt + 1].blocks;
      for (let i = len - 1; i > records.currentOpt; i--) {
        records.operations.pop();
      }
      opera = tag == "group" ? RecordOpts.GROUP : RecordOpts.UNGROUP;
    }

    const length = records.operations.push({
      opera,
      blocks: _.cloneDeep(groupBefore ? groupBefore : blocks.value),
    });
    //组合的删除操作 currentOpt
    if (
      !(opera == RecordOpts.DEL && tag == "group") &&
      !(opera == RecordOpts.ADD && tag == "ungroup") &&
      !(opera == RecordOpts.ADD && tag == "copy")
    ) {
      records.currentOpt = length - 1;
    }
  }
  //后退操作
  function undoRecordOpts() {
    let index = records.currentOpt;
    if (index - 1 >= 0) {
      const operation = records.operations[index];
      //撤销
      // if (records.operations[index].opera == RecordOpts.MOVE) {
      //   //移动 需要单独操作  因为渲染依赖的代理过的block(对象引用)不存在了?
      //   operation.blocks.forEach(b => {
      //     Object.keys(b).forEach(key => {
      //       const block = blocks.value.get(b.id);
      //       if (block) {
      //         (block[key as BlockAttr] as string | number | boolean) =
      //           b[key as BlockAttr];
      //       }
      //     });
      //   });
      // } else if (records.operations[index - 1].opera == RecordOpts.ADD) {
      //   //单独操作
      //   blocks.value.forEach(b => {
      //     if (!operation.blocks.get(b.id)) {
      //       blocks.value.delete(b.id);
      //     }
      //   });
      // } else {
      //   blocks.value = _.cloneDeep(operation.blocks);
      // }
      //撤销里和当前数据里有的修改，没有的增加
      operation.blocks.forEach(b => {
        const block = blocks.value.get(b.id);
        if (block) {
          Object.keys(b).forEach(key => {
            (block[key as BlockStringKey] as BlockValueType) = b[key as BlockStringKey];
          });
        } else {
          blocks.value.set(b.id, b);
        }
      });
      //当前数据里有的，撤销里没有的 删除 表示是新增操作
      blocks.value.forEach(b => {
        if (!operation.blocks.get(b.id)) {
          blocks.value.delete(b.id);
        }
      });
      records.operations.pop();
      records.currentOpt = index - 1;
    }
  }
  //block唯一ID
  let ID_NUM = 1000;
  //添加
  function addBlock(block: Block, tag?: string) {
    recordOpts(RecordOpts.ADD, tag);
    ID_NUM++;
    block.id = ID_NUM;
    blocks.value.set(ID_NUM, block);
    //此处记录 部分挂载后修改的数据没有记录
    //所以普通需要修改的 移动到mounted修改处 记录
    // if (tag == "group") {
    //   recordOpts(RecordOpts.ADD, tag);
    // }
  }
  //移除
  function removeBlock(id: number, tag?: string) {
    recordOpts(RecordOpts.DEL, tag);
    blocks.value.delete(id);
  }
  //修改
  function modifyBlock(id: number, attrs: string, block: Block) {
    const b = blocks.value.get(id);
    if (!b) return;
    // let attr1, attr2;
    if (attrs.indexOf(".") !== -1) {
      const attrstr = attrs.split(".");
      const attr1 = attrstr[0];
      const attr2 = attrstr[1];
      if (attr1 === "attr") {
        switch (attr2) {
          case "x":
          case "y":
            recordOpts(RecordOpts.MOVE);
            break;
          case "width":
          case "height":
            recordOpts(RecordOpts.LAYOUT);
            break;
          case "zIndex":
            recordOpts(RecordOpts.LEVEL);
            break;
        }
      }
    }
    _.merge(b, block);
  }
  //block选中
  const focusAndBlocks = computed(() => {
    const focusBlocks: Block[] = [];
    const unFocusBlocks: Block[] = [];
    blocks.value.forEach(block =>
      (block.status.focus ? focusBlocks : unFocusBlocks).push(block)
    );
    return {
      focusBlocks,
      unFocusBlocks,
      lastFocusBlock: focusBlocks[focusBlocks.length - 1],
    };
  });
  //清除选中
  function clearFocusBlock() {
    focusAndBlocks.value.focusBlocks.forEach(block => {
      block.status.focus = false;
      // modifyBlock(block.id, "status.focus", false);
    });
  }
  const { containerRef } = storeToRefs(useDomRefStore());
  //多选
  function multipleBlock(maskArea: Ref<MaskArea>) {
    blocks.value.forEach(block => {
      if (collide(block, maskArea, containerRef, container)) {
        block.status.focus = true;
      }
    });
  }
  return {
    container,
    blocks,
    focusAndBlocks,
    addBlock,
    removeBlock,
    modifyBlock,
    clearFocusBlock,
    multipleBlock,
    undoRecordOpts,
    recordOpts,
  };
});
