<template>
    <div>
        <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        :showCancel="true"
        width="400px"
        @close="closeUpdatePassword"
        >
            <el-form
                :model="formData"
                :rules="rules"
                ref="formDataRef"
                label-width="80px"
                @submit.prevent
            >
                <el-form-item label="新密码" prop="registerPassword">
                    <el-input 
                    size="large"
                    type="password"
                    clearable 
                    placeholder="请输入密码" 
                    v-model="formData.registerPassword"
                    show-password>
                    <template #prefix><span class="iconfont icon-password"></span></template>
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="reRegisterPassword">
                    <el-input
                    size="large"
                    type="password"
                    clearable 
                    placeholder="请确认密码" 
                    v-model="formData.reRegisterPassword"
                    show-password>
                    <template #prefix><span class="iconfont icon-password"></span></template>
                    </el-input>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import {reactive, ref, computed, getCurrentInstance} from 'vue'
const {proxy} = getCurrentInstance()

const api = {
    updatePassword: "/updatePassword"
}

const props = defineProps({
    showUpdatePassword: {
        type: Boolean,
        default: false,
    }
})
const dialogConfig = computed(() => { 
    return {
        show: props.showUpdatePassword,
        title: "修改密码",
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

const submitForm = () => {
    formDataRef.value.validate(async (valid) => {
        if (!valid) {
            closeUpdatePassword()
            return
        }
        let result = await proxy.Request(
            {
                url: api.updatePassword,
                params: {
                    password: formData.registerPassword,
                },
            }
        )
        if (result) {
            proxy.Message.success("密码修改成功")
        }
        closeUpdatePassword()
    })
}

const formData = reactive({
    registerPassword: null,
    reRegisterPassword: null,
})

const formDataRef = ref()

const checkRePassword = (rule, value, callback)=> {
  if (value !== formData.registerPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

const rules = { 
  registerPassword:[{required: true, message: "请输入正确的密码"},{validator: proxy.Verify.password, message: "密码只能是数字，字母，特殊字符8-18位"}],
  reRegisterPassword:[{required: true, message: "请输入正确的确认密码"},{validator: checkRePassword, message: "两次输入密码不一致"}],
}

const emit = defineEmits()
const closeUpdatePassword = ()=>{
    emit("closeUpdatePassword")
}
</script>

<style lang="scss" scoped>
.item {
    display: flex;
    flex-direction: row;
    .text {
        // width: 30px;
        height: 60px;
        line-height: 60px;
    }
    .password {
        margin-bottom: 0;
        .input {
            // width: 200px;
            margin: 0 auto;
        }
    }
}

</style>