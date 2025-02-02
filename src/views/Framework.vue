<template>
    <div class="framework">
        <div class="header">
            <div class="logo">
                <span class="iconfont icon-pan"></span>
                <div class="name">Easy云盘</div>
            </div>
            <div class="right-panel">
                <el-popover
                  :width="800"
                  trigger="click"
                  v-model:visible="showUploader"
                  :offset="20"
                  transition="none"
                  :hide-after="0"
                  :popper-style="{ padding: '0px' }"
                >
                  <template #reference>
                    <span class="iconfont icon-transfer"></span>
                  </template>
                  <template #default>
                    <Uploader
                      ref="uploaderRef"
                      @uploadCallback="uploadCallbackHandler"
                    ></Uploader>
                  </template>
                </el-popover>
                <el-dropdown>
                  <div class="user-info">
                    <div class="avatar">
                      <Avatar
                        :userId="userInfo.userId"
                        :avatar="userInfo.avatar"
                        :timestamp="timestamp"
                        :width="46"
                      ></Avatar>
                    </div>
                    <span class="nick-name">{{ userInfo.nickName }}</span>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="updateAvatar">
                        修改头像
                      </el-dropdown-item>
                      <el-dropdown-item @click="updatePassword">
                        修改密码
                      </el-dropdown-item>
                      <el-dropdown-item @click="logout"> 退出 </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
            </div>
        </div>
        <div class="body">
            <div class="left-sider">
                <div class="menu-list">
                    <div @click="jump(item)" 
                    :class="['menu-item', ((item.menuCode == currentMenu.menuCode)) ? 'active' : '']" v-for="item in menus">
                        <span :class="['iconfont', 'icon-' + item.icon]" ></span>
                        <div class="text">{{item.name}}</div>
                    </div>
                </div>
                <div class="menu-sub-list">
                    <div @click="jump(sub)"
                    :class="['menu-item-sub', sub.path == currentPath ? 'active' : '']" v-for="sub in currentMenu.children">
                        <span :class="['iconfont', 'icon-' + sub.icon]" v-if="sub.icon"></span>
                        <span class="text">{{ sub.name }}</span>
                    </div>
                    <div class="tips" v-if="currentMenu.tips">
                        {{ currentMenu.tips }}
                    </div>
                    <div class="space-info">
                        <div>空间使用</div>
                        <div class="percent">
                            <el-progress
                              :percentage="
                                Math.floor(
                                  (useSpaceInfo.useSpace / useSpaceInfo.totalSpace) * 10000
                                ) / 100
                              "
                              color="#409eff"
                            />
                        </div>
                        <div class="space-use">
                          <div class="use">
                            {{ proxy.Utils.size2Str(useSpaceInfo.useSpace) }}/
                            {{ proxy.Utils.size2Str(useSpaceInfo.totalSpace) }}
                          </div>
                          <div class="iconfont icon-refresh" @click="getUseSpace"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body-content">
              <router-view v-slot="{ Component }">
                <component
                  @addFile="addFile"
                  ref="routerViewRef"
                  :is="Component"
                  @reload="getUseSpace"
                />
              </router-view>
            </div>
        </div>
        <UpdateAvatar 
        :userInfo="userInfo" 
        :showUpdateAvatar="showUpdateAvatar" 
        @closeUpdateAvatar="closeUpdateAvatar" 
        @reloadAvatar="reloadAvatar"></UpdateAvatar>

        <UpdatePassword 
        :showUpdatePassword="showUpdatePassword"
        @closeUpdatePassword="closeUpdatePassword">
        </UpdatePassword>
    </div>
</template>

<script setup>
import { reactive, ref, watch, getCurrentInstance} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const {proxy} = getCurrentInstance()

const api = {
  logout: "/logout",
  getUseSpace: "/getUseSpace"
}


//添加文件
const showUploader = ref(false)
const uploaderRef = ref()
const addFile = (data) => {
  const {file, filePid} = data
  // console.log(file)
  // console.log(filePid)
  showUploader.value = true
  uploaderRef.value.addFile(file, filePid)
}

// 用户空间
const useSpaceInfo = ref({useSpace: 0, totalSpace: 0})
const getUseSpace = async () => {
  let result = await proxy.Request({
    url: api.getUseSpace,
    showLoading: false,
  })
  if (!result) {
    return
  }
  // console.log(result.data)
  useSpaceInfo.value = result.data
}
getUseSpace()

const routerViewRef = ref()
const uploadCallbackHandler = ()=> {
  proxy.Message.success("上传文件成功")
  routerViewRef.value.reload()
  //更新用户空间
  getUseSpace()
}

const timestamp = ref(0)
const userInfo = reactive(proxy.VueCookies.get("userInfo"))

const menus = [
  {
    icon: "cloude",
    name: "首页",
    menuCode: "main",
    path: "/main/all",
    allShow: true,
    children: [
      {
        icon: "all",
        name: "全部",
        category: "all",
        path: "/main/all",
      },
      {
        icon: "video",
        name: "视频",
        category: "video",
        path: "/main/video",
      },
      {
        icon: "music",
        name: "音频",
        category: "music",
        path: "/main/music",
      },
      {
        icon: "image",
        name: "图片",
        category: "image",
        path: "/main/image",
      },
      {
        icon: "doc",
        name: "文档",
        category: "doc",
        path: "/main/doc",
      },
      {
        icon: "more",
        name: "其他",
        category: "others",
        path: "/main/others",
      },
    ],
  },
  {
    path: "/myshare",
    icon: "share",
    name: "分享",
    menuCode: "share",
    allShow: true,
    children: [
      {
        name: "分享记录",
        path: "/myshare",
      },
    ],
  },
  {
    path: "/recycle",
    icon: "del",
    name: "回收站",
    menuCode: "recycle",
    tips: "回收站为你保存10天内删除的文件",
    allShow: true,
    children: [
      {
        name: "删除的文件",
        path: "/recycle",
      },
    ],
  },
]

const currentMenu = ref()
const currentPath = ref()
const route = useRoute()
const router = useRouter()

const jump = (item) => {//变换路由地址
    if (!item.path || item.menuCode == currentMenu.value.menuCode) {
        return
    }
    router.push(item.path)//路由到item.path
}

const setMenu = (menuCode, path) => {
    const menu = menus.find(item=> {return item.menuCode === menuCode})
    currentMenu.value = menu
    currentPath.value = path
    // console.log("currentPath", currentPath.value)
}

watch(()=> route, (newVal, oldVal)=> {
    if (newVal.meta.menuCode) {
        setMenu(newVal.meta.menuCode, newVal.path)
    }
}, {immediate: true, deep: true})



//修改头像 
const showUpdateAvatar = ref(false)
const updateAvatar = ()=> {
  showUpdateAvatar.value = true
}
const closeUpdateAvatar = ()=>{
  showUpdateAvatar.value = false
}
const reloadAvatar = ()=> {
  timestamp.value = new Date().getTime()
}
//修改密码
const showUpdatePassword = ref(false)
const updatePassword = ()=> {
  showUpdatePassword.value = true
}
const closeUpdatePassword = () => {
  showUpdatePassword.value = false
}
//退出
const logout = ()=> {
  proxy.Confirm(`你确定要退出登入吗？`, async ()=>{
    let result = await proxy.Request({
        url: api.logout,
    })
    if (result) {
      proxy.Message.success("退出登录")
      proxy.VueCookies.remove("userInfo")
      router.push("/login")
    }
  })
}

</script>

<style lang="scss" scoped>
.header {
  box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;
    .icon-pan {
      font-size: 40px;
      color: #1296db;
    }
    .name {
      font-weight: bold;
      margin-left: 5px;
      font-size: 25px;
      color: #05a1f5;
    }
  }
  .right-panel {
    display: flex;
    align-items: center;
    .icon-transfer {
      cursor: pointer;
    }
    .user-info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .avatar {
        margin: 0px 5px 0px 15px;
      }
      .nick-name {
        color: #05a1f5;
      }
    }
  }
}
.body {
  display: flex;
  .left-sider {
    border-right: 1px solid #f1f2f4;
    display: flex;
    .menu-list {
      height: calc(100vh - 56px);
      width: 80px;
      box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
      border-right: 1px solid #f1f2f4;
      .menu-item {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        padding: 20px 0px;
        cursor: pointer;
        &:hover {
          background: #f3f3f3;
        }
        .iconfont {
          font-weight: normal;
          font-size: 28px;
        }
      }
      .active {
        .iconfont {
          color: #06a7ff;
        }
        .text {
          color: #06a7ff;
        }
      }
    }
    .menu-sub-list {
      width: 200px;
      padding: 20px 10px 0px;
      position: relative;
      .menu-item-sub {
        text-align: center;
        line-height: 40px;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          background: #f3f3f3;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 20px;
        }
        .text {
          font-size: 13px;
        }
      }
      .active {
        background: #eef9fe;
        .iconfont {
          color: #05a1f5;
        }
        .text {
          color: #05a1f5;
        }
      }

      .tips {
        margin-top: 10px;
        color: #888888;
        font-size: 13px;
      }

      .space-info {
        position: absolute;
        bottom: 10px;
        width: 100%;
        padding: 0px 5px;
        .percent {
          padding-right: 10px;
        }
        .space-use {
          margin-top: 5px;
          color: #7e7e7e;
          display: flex;
          justify-content: space-around;
          .use {
            flex: 1;
          }
          .iconfont {
            cursor: pointer;
            margin-right: 20px;
            color: #05a1f5;
          }
        }
      }
    }
  }
  .body-content {
    flex: 1;
    width: 0;
    padding-left: 20px;
  }
}
.hideBorder{
    border: 0;
}
</style>