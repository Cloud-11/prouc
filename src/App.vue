<script setup lang="ts">
import Editor from "@/packages/editor";
import RightMenu from "@/components/rightMenu";
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