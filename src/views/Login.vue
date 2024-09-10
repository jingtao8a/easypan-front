<template>
   <div class="login-body">
      <div class="bg"></div>
      <div class="login-panel">
        <el-form class="login-register" 
        :model="formData" 
        :rules="rules" 
        ref="formDataRef"
        @submit.prevent>
          <div class="login-title">EasyPan 云盘</div>
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input size="large"
             clearable placeholder="请输入邮箱" 
             v-model="formData.email"
             maxlength="150">
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
            </el-input>
          </el-form-item>
          <!-- 登入密码 -->
          <el-form-item prop="password" v-if="optType == 1">
            <el-input size="large"
             type="password"
             clearable placeholder="请输入密码" 
             v-model="formData.password"
             show-password>
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
            </el-input>
          </el-form-item>
          <!-- 注册 -->
           <div v-if="optType == 0 || optType == 2">
              <!-- 获取邮箱验证码 -->
              <el-form-item  prop="emailCode">
                <div class="send-email-panel">
                  <el-input
                  clearable
                  placeholder="请输入邮箱验证码"
                  v-model="formData.emailCode">
                    <template #prefix>
                      <span class="iconfont icon-checkcode"></span>
                    </template>
                  </el-input>
                  <el-button class="send-mail-btn" type="primary" size="large" @click="getEmailCode">
                    <span>获取邮箱验证码</span>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item  prop="nickName" v-if="optType == 0">
                <el-input
                  size="large"
                  clearable
                  placeholder="请输入用户昵称"
                  v-model="formData.nickName">
                    <template #prefix>
                      <span class="iconfont icon-account"></span>
                    </template>
                </el-input>
              </el-form-item>
              <!-- 注册密码 -->
              <el-form-item prop="registerPassword">
                <el-input 
                size="large"
                type="password"
                clearable 
                placeholder="请输入密码" 
                v-model="formData.registerPassword"></el-input>
              </el-form-item>
              <!-- 再次输入注册密码 -->
              <el-form-item prop="reRegisterPassword">
                <el-input 
                size="large"
                type="password"
                clearable 
                placeholder="请确认密码" 
                v-model="formData.reRegisterPassword"></el-input>
              </el-form-item>
           </div>
           
          <!-- 图形验证码 -->
          <el-form-item prop="checkCode">
            <div class="check-code-panel">
              <el-input size="large"
              clearable placeholder="请输入验证码" 
              v-model="formData.checkCode">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
              </el-input>
              <img class="check-code" :src="checkCodeUrl0" @click="changeCheckCode(0)" alt="checkcode">
            </div>
          </el-form-item>
          <!-- 下拉框(登入) -->
          <el-form-item v-if="optType == 1">
            <div class="rememberme-panel">
              <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
            </div>
            <div class="no-account">
              <a class="a-link" href="" @click.prevent="showPanel(2)">忘记密码?</a>
              <a class="a-link" href="" @click.prevent="showPanel(0)">没有账号</a>
            </div>      
          </el-form-item>
          <!-- 下拉框(注册 或 忘记密码) -->
          <el-form-item v-if="optType == 0 || optType == 2">
            <div class="no-account">
              <a class="a-link" v-if="optType==0" href="" @click.prevent="showPanel(1)">已有账号? </a>
              <a class="a-link" v-if="optType==2" href="" @click.prevent="showPanel(1)">去登入? </a>
            </div>  
          </el-form-item>
          <!-- 登入按钮 -->
          <el-form-item>
            <el-button type="primary" size="large" class="op-btn" @click="doSubmit">
              <span v-if="optType == 0">注册</span>
              <span v-if="optType == 1">登入</span>
              <span v-if="optType == 2">重置密码</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <Dialog
        :show="dialogConfig4SendEmailCode.show"
        :title="dialogConfig4SendEmailCode.title"
        :buttons="dialogConfig4SendEmailCode.buttons"
        width="500px"
        :showCancel="false"
        @close="dialogConfig4SendEmailCode.show = false">
        <el-form
        :model="formData4SendEmailCode"
        :rules="rules"
        ref="formDataRef4SendEmailCode"
        label-width="80px"
        @submit.prevent>
          <el-form-item label="邮箱">
            {{formData4SendEmailCode.email}}
          </el-form-item>
          <!-- 邮箱验证码 -->
          <el-form-item label="验证码" prop="checkCode">
            <div class="check-code-panel">
              <el-input size="large"
              clearable placeholder="请输入邮箱验证码" 
              v-model="formData4SendEmailCode.checkCode">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
              </el-input>
              <img class="check-code" :src="checkCodeUrl1" @click="changeCheckCode(1)" alt="checkcode">
            </div>
          </el-form-item>
        </el-form>
      </Dialog>
   </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick} from "vue"

const {proxy} = getCurrentInstance()

//图形验证码
const api = {
  checkCode: "/api/checkCode",
  sendEmailCode: "/sendEmailCode"
}

const checkCodeUrl0 = ref(api.checkCode + "?type=0&time" + new Date().getTime())
const checkCodeUrl1 = ref(api.checkCode + "?type=1&time" + new Date().getTime())
const changeCheckCode = (type)=> {
  if (type == 0) {
    checkCodeUrl0.value = api.checkCode + "?type=0&time" + new Date().getTime()
  } else if (type == 1) {
    checkCodeUrl1.value = api.checkCode + "?type=1&time" + new Date().getTime()
  }
}

//操作类型 0：注册 1：登入 2：重置密码
const optType = ref(1)
const showPanel = (type) => {
  optType.value = type
}

const checkRePassword = (rule, value, callback)=> {
  if (value !== formData.registerPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const formData = reactive({
  email: "",
  password: "",
  checkCode: "",
  rememberMe: null,
  emailCode: "",
  nickName: "",
  registerPassword: "",
  reRegisterPassword: "",
})
const formDataRef = ref()
const rules = { 
  email:[{required: true, message: "请输入正确的邮箱",}, {validator: proxy.Verify.email, message:"请输入正确的邮箱"}],
  password:[{required: true, message: "请输入正确的密码",},{validator: proxy.Verify.password, message: "请输入正确的密码"}],
  checkCode:[{required: true, message: "请输入图形验证码"}],
  emailCode:[{required: true, message: "请输入邮箱验证码"}],
  nickName:[{required: true, message: "请输入昵称"}],
  registerPassword:[{required: true, message: "请输入正确的密码"},{validator: proxy.Verify.password, message: "密码只能是数字，字母，特殊字符8-18位"}],
  reRegisterPassword:[{required: true, message: "请输入正确的确认密码"},{validator: checkRePassword, message: "两次输入密码不一致"}],
}

//发送邮箱验证码

const dialogConfig4SendEmailCode = reactive({
  show: false,
  title: "发送邮箱验证码",
  buttons : [
    {
      type:"primary",
      text: "发送验证码",
      click: (e)=>{
        sendEmailCode();
      }}
  ]
})

const formData4SendEmailCode = reactive({
  email: "",
  checkCode: "",
})

const formDataRef4SendEmailCode = ref()

const getEmailCode = ()=> {
  formDataRef.value.validateField("email", (valid)=>{
    if (!valid) {
      return
    }
    changeCheckCode(1)
    formData4SendEmailCode.checkCode = null;
    formData4SendEmailCode.email = formData.email
    dialogConfig4SendEmailCode.show = true;
  })
}

const sendEmailCode = () => {
  formDataRef4SendEmailCode.value.validate(async (valid)=>{
    if (!valid) {
      return
    }
    const params = Object.assign({}, formData4SendEmailCode)
    if (optType.value == 0) {//注册
      params.type = 0
    } else if (optType.value == 2) {//找回密码
      params.type = 1
    }
    console.log("params", params, "optType", optType)
    let result = await proxy.Request({
      url: api.sendEmailCode,
      params: params,
      errorCallback: ()=> {
        console.log("errorCallback trigger")
        changeCheckCode(1)
      }
    })
    if (!result) {
      return
    }
    proxy.Message.success("验证码发送成功，请登入邮箱查看")
    dialogConfig4SendEmailCode.show = false//关闭dialog
  })
}

//登入、注册、重置密码 提交表单
const doSubmit = ()=> {
  formDataRef.value.validate((valid)=>{
    if (!valid) {
      return
    }
    
  })
}
</script>

<style lang="scss" scoped>
.login-body {
  height: calc(100vh);
  background-image: url("../assets/login_bg.jpg");
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .bg {
    width: 800px;
    background-image: url("../assets/login_img.png");
    background-repeat: no-repeat;
  }
  .login-panel {
    width: 430px;
    margin-right: 15%;
    margin-top: calc((100vh - 500px) / 2);
    .login-register {
      padding: 25px;
      background: #fff;
      border-radius: 5px;
      .login-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .send-email-panel {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .send-mail-btn {
          margin-left: 5px;
        }
      }
      .rememberme-panel {
        width: 100%;
      }
      .no-account {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .op-btn {
        width: 100%;
      }
    }
  }

  .check-code-panel {
    width: 100%;
    display: flex;
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
</style>