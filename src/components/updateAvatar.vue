<template>
    <div>
        <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        :showCancel="true"
        width="400px"
        @close="closeUpdateAvatar"
        >
        <el-form
            :model="formData"
            ref="formDataRef"
            label-width="80px"
            @submit.prevent
        >
            <el-form-item label="昵称">
                {{formData.nickName}}
            </el-form-item>

            <el-form-item label="头像上传">
                <AvatarUpload :model-value="formData" @update:modelValue="(file)=>{uploadFile = file}"></AvatarUpload>
            </el-form-item>
        </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import {reactive, ref, computed, getCurrentInstance} from 'vue'
import AvatarUpload from '@/components/AvatarUpload.vue';

const {proxy} = getCurrentInstance()

const api = {
    updateUserAvatar: "updateUserAvatar",
}

const props =defineProps({
    userInfo: {
        type: Object
    },
    showUpdateAvatar: {
        type: Boolean,
        default: false
    }
})

const formData = reactive({
    userId: props.userInfo.userId, 
    nickName: props.userInfo.nickName
})

const formDataRef = ref()

const dialogConfig = computed(() => { 
    return {
        show: props.showUpdateAvatar,
        title: "修改头像",
        buttons: [
            {
            type:"primary",
            text: "确定",
            click: (e)=>{
                submitForm()
            }}
        ],
    }
})

const uploadFile = ref("")

const submitForm = async () => {
    if (uploadFile.value instanceof File) {
        let result = await proxy.Request({
            url: api.updateUserAvatar,
            params: {
                avatar: uploadFile.value
            }
        })
        if (result) {
            proxy.Message.success("更新头像成功")
            emit("reloadAvatar")
        }
    }
    closeUpdateAvatar()
}

const emit = defineEmits()
const closeUpdateAvatar = ()=>{
    emit("closeUpdateAvatar")
}


</script>

<style lang="scss" scoped>
</style>