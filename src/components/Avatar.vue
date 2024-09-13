<template>
    <el-avatar :size="50" :src="avatar && avatar != '' ? avatar : `${proxy.globalInfo.avatarUrl}${userId}?${timestamp}`" @error="errorHandler">
      <img
        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
      />
    </el-avatar>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const {proxy} = getCurrentInstance()

const props = defineProps(
    {
        userId: {
            type: String,
        },
        avatar: {
            type: String,
        },
        timestamp: {
            type: Number,
            default: 0,
        },
    }
)

const errorHandler = () => {
    Proxy.Message.error("获取用户头像失败")
}
</script>

<style lang="scss" scoped>
</style>