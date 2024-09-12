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
</script>

<style lang="scss" scoped>
// .avatar {
//     display: flex;
//     width: 40px;
//     height: 40px;
//     border-radius: 50%;
//     overflow: hidden;
//     img {
//         width: 10%;
//         object-fit: cover;
//     }
// }
</style>