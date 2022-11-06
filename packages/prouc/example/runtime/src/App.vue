<script setup lang="ts">
import { Render, installComponents } from "@prouc/runtime";
import { reviver } from "@prouc/shared";
import { componentsClassList } from "@prouc/ui";
import { ref } from "vue";
import data from "./data.json";
installComponents(componentsClassList);
const blocks = ref(JSON.parse(JSON.stringify(data), reviver));
</script>

<template>
  <Render :blocks="blocks"></Render>
</template>

<style scoped></style>
