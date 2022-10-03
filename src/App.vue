<script setup lang="ts">
import { provide, ref } from 'vue'
import data from "./data.json"
import Editor from "./packages/editor";
import compontentsConfig from './utils/editorCompontentsConfig';

provide("compontentsConfig", compontentsConfig)

const state = ref(data)
</script>

<template>
    <Editor v-model=state></Editor>
</template>
