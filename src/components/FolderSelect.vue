<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="600px"
      :showCancel="true"
      @close="close"
    >
      <div class="navigation-panel">
        <Navigation
          ref="navigationRef"
          @navChange="navChange"
          :watchPath="false"
        ></Navigation>
      </div>
      <div class="folder-list" v-if="folderList.length > 0">
        <div
          class="folder-item"
          v-for="item in folderList"
          @click="selectFolder(item)"
        >
          <icon :fileType="0"></icon>
          <span class="file-name">{{ item.fileName }}</span>
        </div>
      </div>
      <div v-else class="tips">
        移动到 <span>{{ currentFolder.fileName }}</span> 文件夹
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadAllFolder: "/file/loadAllFolder",
};

const dialogConfig = ref({
  show: false,
  title: "移动到",
  buttons: [
    {
      type: "primary",
      text: "移动到此",
      click: () => {
        moveFolderDone();
      },
    },
  ],
});

//确定选择目录
const emit = defineEmits(["moveFolderDone"]);
const moveFolderDone = () => {
  emit("moveFolderDone", filePid.value);
};

//父级ID
const filePid = ref("0");//FolderSelect的当前父目录
const currentFileIds = ref({});//exclude fileIds
const folderList = ref([]);//filePid目录下的所有可以移动到的文件夹
const currentFolder = ref({});//FolderSelect的当前父目录

const loadAllFolder = async () => {
  let result = await proxy.Request({
    url: api.loadAllFolder,
    params: {
      filePid: filePid.value,
      currentFileIds: currentFileIds.value,
    },
  });
  if (!result) {
    return;
  }
  folderList.value = result.data;
};

const close = () => {
  dialogConfig.value.show = false;
};

//展示弹出框对外的方法
const showFolderDialog = (excludeFileIds) => {
  dialogConfig.value.show = true;
  currentFileIds.value = excludeFileIds;
  filePid.value = "0";
  nextTick(()=>{
    navigationRef.value.init()
  })
};

defineExpose({
  showFolderDialog,
  close,
});
// //选择目录
const navigationRef = ref();
const selectFolder = (data) => {
  navigationRef.value.openFolder(data);
};


// //导航改变回调
const navChange = (newCurrentFolder) => {
  currentFolder.value = newCurrentFolder;
  filePid.value = newCurrentFolder.fileId;
  loadAllFolder();
};
</script>
<style lang="scss" scoped>
.navigation-panel {
  padding-left: 10px;
  background: #f1f1f1;
}
.folder-list {
  max-height: calc(100vh - 200px);
  min-height: 200px;
  .folder-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;
    .file-name {
      display: inline-block;
      margin-left: 10px;
    }
    &:hover {
      background: #f8f8f8;
    }
  }
}
.tips {
  text-align: center;
  line-height: 200px;
  span {
    color: #06a7ff;
  }
}
</style>