<template>
        <RouterView></RouterView>
</template>

<script setup>

import {reactive} from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const locale = zhCn;
const config = reactive({
    max : 1
});

</script>

<style scoped lang="scss">
</style>
