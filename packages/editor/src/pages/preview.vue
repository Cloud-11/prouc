<script setup lang="ts">
import { Render } from "@prouc/runtime-render";
import { DATA_JSON, reviver } from "@prouc/shared";

const data: DATA_JSON["blocks"] = JSON.parse(
  localStorage.getItem("blocks") || "",
  reviver
);
//注册运行时组件
//editor不用注册
// installComponents(userConfig.componentList);
</script>
<template>
  <Render :blocks="data"></Render>
</template>
<style lang="scss"></style>
