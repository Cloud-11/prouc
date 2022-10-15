<script setup lang="ts">
import Editor from "@/packages/editor";
import RightMenu from "@/components/rightMenu";
import { useRightMenuHandler } from "./configs/menusConfig";
import { storeToRefs } from "pinia";
import { useDomRefStore, useGlobalDataStore, useJsonDataStore } from "./stores";
import { onMounted, onUnmounted, provide, Ref } from "vue";
import { useKeyDownEvent } from "@/hooks/useKeyDownEvent";
import rightMenuOpts from "@/configs/menusConfig";

const { focusAndBlocks } = storeToRefs(useJsonDataStore());
const { addBlock, modifyBlock, removeBlock, clearFocusBlock, undoRecordOpts } = useJsonDataStore();
const { contentRef } = storeToRefs(useDomRefStore());
const { clipboard, copyMousePos } = storeToRefs(useGlobalDataStore());
//初始化快捷键功能
const commands = useRightMenuHandler(
    focusAndBlocks,
    removeBlock,
    addBlock,
    modifyBlock,
    clearFocusBlock, undoRecordOpts,
    contentRef as Ref<HTMLElement>,
    clipboard,
    copyMousePos
);
const { init, destory } = useKeyDownEvent(commands, rightMenuOpts);
onMounted(() => init());
onUnmounted(() => destory());
provide("commands", commands)
</script>

<template>
    <header class="header">
        <div class="header-item left"></div>
        <div class="header-item center">工作画布</div>
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
        background-color: bisque;
    }

    .right {
        background-color: aquamarine;
    }
}
</style>
