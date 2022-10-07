<script setup lang="ts">
import { provide, ref } from 'vue'
import data from "./data.json"
import Editor from "./packages/editor";
import componentsConfig from './utils/editorComponentsConfig';

provide("componentsConfig", componentsConfig)

const state = ref(data)
</script>

<template>
    <Editor v-model=state></Editor>
</template>
