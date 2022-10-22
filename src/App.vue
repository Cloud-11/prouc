<script setup lang="ts">
import Editor from "@/packages/editor";
import RightMenu from "@/components/rightMenu";
import { useRightMenuHandler } from "./configs/menusConfig";
import { storeToRefs } from "pinia";
import { useDomRefStore, useGlobalDataStore, useJsonDataStore } from "./stores";
import { onMounted, onUnmounted, provide, Ref } from "vue";
import { useKeyDownEvent } from "@/hooks/useKeyDownEvent";
import rightMenuOpts from "@/configs/menusConfig";
import { useRegisterRightMenu } from "./hooks/useRightMenu";
import { useContainerFuncKey } from "./hooks/useContainerEvent";
import { Undo, Upload, Download } from "@icon-park/vue-next"

const { focusAndBlocks, container } = storeToRefs(useJsonDataStore());
const { addBlock, modifyBlock, removeBlock, clearFocusBlock, undoRecordOpts } = useJsonDataStore();
const { containerRef, contentRef } = storeToRefs(useDomRefStore());
const { clipboard, copyMousePos } = storeToRefs(useGlobalDataStore());
//初始化所有右键功能
const commands = useRightMenuHandler(
    focusAndBlocks,
    removeBlock,
    addBlock,
    modifyBlock,
    clearFocusBlock, undoRecordOpts,
    containerRef as Ref<HTMLElement>,
    contentRef as Ref<HTMLElement>,
    container,
    clipboard,
    copyMousePos
);
const { rightMenuKeyboard } = useRegisterRightMenu(commands, rightMenuOpts)

const { init, destory, registerKeyboard } = useKeyDownEvent();

const { containerFuncKeyDown, containerFuncKeyUp, isShowContainerMask } = useContainerFuncKey();

//注册全局快捷键
registerKeyboard(rightMenuKeyboard)
registerKeyboard(containerFuncKeyDown, containerFuncKeyUp)

provide("isShowContainerMask", isShowContainerMask)

onMounted(() => init());
onUnmounted(() => destory());
provide("commands", commands)
</script>

<template>
    <header class="header">
        <div class="header-item left"></div>
        <div class="header-item center">
            <el-button>撤销
                <template v-slot:icon>
                    <Undo theme="outline" size="24" fill="#1890ff" />
                </template>
            </el-button>
            <el-button> 导入
                <template v-slot:icon>
                    <upload theme="outline" size="24" fill="#1890ff" />
                </template>

            </el-button>
            <el-button>导出
                <template v-slot:icon>
                    <download theme="outline" size="24" fill="#1890ff" />
                </template>
            </el-button>
        </div>
        <div class="header-item right"></div>
    </header>
    <Editor></Editor>
    <RightMenu></RightMenu>
</template>
<style lang="scss">
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;

    &-item {
        width: 100px;
        line-height: 50px;
        text-align: center;
    }

    .left {
        background-color: aqua;
    }

    .center {
        display: flex;
        align-items: center;
        margin-top: 20px;
    }

    .right {
        background-color: aquamarine;
    }
}
</style>
