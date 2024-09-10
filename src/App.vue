<template>
    <!-- :locale="locale"  -->
    <el-config-provider :message="config">
        <RouterView></RouterView>
    </el-config-provider>
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
