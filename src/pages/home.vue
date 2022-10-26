<script setup lang="ts">
import Editor from "@/packages/editor";
import RightMenu from "@/components/RightMenu";
import ControlMenu from "@/components/ControlMenu"
import { useRightMenuHandler } from "@/configs/menusConfig";
import { storeToRefs } from "pinia";
import { useDomRefStore, useGlobalDataStore, useJsonDataStore } from "@/stores";
import { onMounted, onUnmounted, provide, Ref } from "vue";
import { useKeyDownEvent } from "@/hooks/useKeyDownEvent";
import rightMenuOpts from "@/configs/menusConfig";
import { useRegisterRightMenu } from "@/hooks/useRightMenu";
import { useContainerFuncKey } from "@/hooks/useContainerEvent";


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
        <div class="header-item left">
            <img width="160" height="50" src="/icon.png" alt="">
        </div>
        <div class="header-item center">
            <ControlMenu></ControlMenu>
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

    }

    .left {
        width: 370px;
    }

    .center {
        display: flex;
        align-items: center;
        margin-top: 20px;
        justify-content: space-around;
    }

    .right {
        width: 440px;
    }
}
</style>
