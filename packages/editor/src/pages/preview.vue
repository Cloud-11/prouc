<script setup lang="ts">
import { Render } from "@prouc/runtime-render"
import { DATA_JSON, reviver } from "@prouc/shared"

// const { blocks } = storeToRefs(useJsonDataStore());
const data: DATA_JSON["blocks"] = JSON.parse(localStorage.getItem("blocks") || "", reviver);
// blocks.value = data;

</script>
<template >
    <Render :blocks="data"></Render>
</template>
<style lang="scss">

</style>