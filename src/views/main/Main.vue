<template>
    <div>
        <div class="top">
            <div class="top-op">
                <div class="btn">
                <el-upload
                :show-file-list="false"
                :with-credentials="true"
                :multiple="true"
                :http-request="addFile"
                :accept="fileAccept">
                    <el-button type="primary">
                    <span class="iconfont icon-upload"></span>
                    上传
                    </el-button>
                </el-upload>
                </div>
                <el-button type="success" @click="newFolder" v-if="category == 'all'">
                    <span class="iconfont icon-folder-add"></span>
                    新建文件夹
                </el-button>
                <el-button type="danger" @click="delFileBatch" :disabled="selectFileIdList.length == 0">
                    <span class="iconfont icon-del"></span>
                    批量删除
                </el-button>
                <el-button type="warning" @click="moveFolderBatch" :disabled="selectFileIdList.length == 0">
                    <span class="iconfont icon-move"></span>
                    批量移动
                </el-button>
                <div class="search-panel" >
                    <el-input clearable v-model="fileNameFuzzy" placeholder="输入文件名搜索">
                        <template #suffix>
                            <i class="iconfont icon-search" @click="search"></i>
                        </template>
                    </el-input>
                </div>
                <div class="iconfont icon-refresh" @click="loadDataList"></div>
            </div>
            <!-- 导航 -->
            <Navigation ref="navigationRef" @navChange="navChange"></Navigation>
        </div>
        <div class="file-list" v-if="tableData.list && tableData.list.length > 0">
            <Table 
            ref="dataTableRef" 
            :columns="columns"
            :dataSource="tableData"
            :fetch="loadDataList"
            :initFetch="true"
            :options="tableOptions"
            @rowSelected="rowSelected">
                <template #fileName="{index, row}">
                    <div class="file-item"
                    @mouseenter="showOp(row)"
                    @mouseleave="cancelShowOp(row)">
                        <!-- 文件类型为 图片(3) 或 视频(1) -->
                        <template v-if="(row.fileType == 3 || row.fileType == 1) && (row.status == 2)"> 
                            <Icon :cover="row.fileCover" :width="32"></Icon>
                        </template>
                        <template v-else>
                            <!-- 为目录 -->
                            <Icon v-if="row.folderType == 1" :fileType="0"></Icon>
                            <!-- 为其它类型文件 -->
                            <Icon v-else :fileType="row.fileType"></Icon>
                        </template>
                        <span class="file-name" v-if="!row.showEdit" :title="row.fileName">
                            <span @click="preview(row)">{{ row.fileName }}</span>
                            <span v-if="row.status == 0" class="transfer-status">转码中</span>
                            <span v-if="row.status == 1" class="transfer-status transfer-fail">转码失败</span>
                        </span>
                        <div class="edit-panel" v-if="row.showEdit">
                            <el-input
                                v-model="row.fileNameReal"
                                ref="editNameRef"
                                :maxLength="190"
                                @keyup.enter="saveNameEdit(index)">
                                <template #suffix>{{ row.fileSuffix }}</template>
                            </el-input>
                            <span :class="['iconfont icon-right1', row.fileNameReal ? '' : 'not-allow',]"
                                @click="saveNameEdit(index)"></span>
                            <span class="iconfont icon-error" @click="cancelNameEdit(index)"></span>
                            </div>
                        <span class="op">
                            <template v-if="row.showOp && row.fileId && row.status == 2">
                                <span class="iconfont icon-share1" @click="share(row)">分享</span>
                                <span class="iconfont icon-download" @click="download(row)" v-if="row.folderType == 0">下载</span>
                                <span class="iconfont icon-del" @click="delFile(row)">删除</span>
                                <span class="iconfont icon-edit" @click.stop="editFileName(index)">重命名</span>
                                <span class="iconfont icon-move" @click="moveFolder(row)">移动</span>
                            </template>
                        </span>
                    </div>
                </template>
                <template #fileSize="{ index, row }">
                    <span v-if="row.fileSize">
                        {{ proxy.Utils.size2Str(row.fileSize) }}</span
                    >
                </template>
            </Table>
        </div>
        <div class="no-data" v-else>
            <div class="no-data-inner">
                <Icon iconName="no_data" :width="120" fit="fill"></Icon>
                <div class="tips">当前目录为空，上传你的第一个文件吧</div>
                <div class="op-list">
                <el-upload
                    :show-file-list="false"
                    :with-credentials="true"
                    :multiple="true"
                    :http-request="addFile"
                    :accept="fileAccept">
                    <div class="op-item">
                    <Icon iconName="file" :width="60"></Icon>
                    <div>上传文件</div>
                    </div>
                </el-upload>
                <div class="op-item" v-if="category == 'all'" @click="newFolder">
                    <Icon iconName="folder" :width="60"></Icon>
                    <div>新建目录</div>
                </div>
                </div>
            </div>
        </div>
        <FolderSelect ref="folderSelectRef" @moveFolderDone="moveFolderDone"></FolderSelect>
    </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, watch, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
const {proxy} = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const dataTableRef = ref()

const columns = [
    {
        label: "文件名",
        prop: "fileName",
        scopedSlots: "fileName",
    },
    {
        label: "修改时间",
        prop: "lastUpdateTime",
        width: 200,
    },
    {
        label: "大小",
        prop: "fileSize",
        scopedSlots: "fileSize",
        width: 200
    }
]

const api = {
  loadDataList: "/file/loadDataList",
  rename: "/file/rename",
  newFoloder: "/file/newFoloder",
  getFolderInfo: "/file/getFolderInfo",
  delFile: "/file/delFile",
  changeFileFolder: "/file/changeFileFolder",
  createDownloadUrl: "/file/createDownloadUrl",
  download: "/api/file/download",
}

const tableData = ref({})
const tableOptions = reactive({
    extHeight: 50,
    selectType: "checkbox",
})
const fileNameFuzzy = ref()
const category = ref()//当前展示的类别

const currentFolder = ref({ fileId: 0 });//当前父目录
const navChange = (newCurrentFolder) => {
    console.log("navChange")
    currentFolder.value = newCurrentFolder
    loadDataList()
}
const navigationRef = ref()

//改变Category的一系列方法
let alreadyMounted = false

onMounted(() => {
    alreadyMounted = true
    category.value = getCategory(route.path)
    if (category.value == null) {
        category.value = "all"
    }
    loadDataList()
})

const getCategory = (path) => {
    if (path.indexOf('main') != -1) {
        let newCategory = path.slice(6)
        if (newCategory.indexOf('?') != -1) {
            newCategory = newCategory.slice(0, category.indexOf('?'))
        }
        return newCategory
    }
    return null
}

const changeCategory = (path) => {
    let newCategory = getCategory(path)
    if (newCategory != null && category.value != newCategory) {
        category.value = newCategory
        loadDataList()
    }
}

watch(()=> route, (newVal, oldVal)=> {
    if (newVal.meta.menuCode && alreadyMounted) {
        changeCategory(newVal.path)
    }
}, {immediate: true, deep: true})

const emit = defineEmits(["addFile"])
//添加文件
const addFile = (fileData) => {
    emit("addFile", {file: fileData.file, filePid: currentFolder.value.fileId})
}

//新建目录
const newFolder = () => {
    if (editing.value) {//处在编辑状态直接返回
        return;
    }
    tableData.value.list.forEach((element) => {
        element.showEdit = false;
    });
    editing.value = true;
    tableData.value.list.unshift({
        showEdit: true,
        fileType: 0,
        fileId: "",
        filePid: currentFolder.value.fileId,
    });
    // editNameRef.value.focus();
}

//批量删除文件
const delFileBatch = () => {
    if (selectFileIdList.value.length == 0) {//没有文件Id列表为空
        return
    }
    proxy.Confirm("你确定要删除这些文件吗？删除的文件可在10天内通过回收站还原", async () => {
        let result = await proxy.Request({
            url: api.delFile,
            params: {
                fileIds: selectFileIdList.value.join(',')
            }
        })
        if (!result) {
            return
        }
        proxy.Message.success("删除文件成功")
        loadDataList()
    })

}

//批量移动文件
const moveFolderBatch = () => {
    currentMoveFile.value = null
    let excludeFileIdList = [currentFolder.value.fileId]
    for (let fileItem of selectFileList.value) {
        if (fileItem.folderType == "1") {
            excludeFileIdList.push(fileItem.fileId)
        }
    }
    folderSelectRef.value.showFolderDialog(excludeFileIdList.join(','))
}

//输入文件名搜索
const search = () => {
    loadDataList()
}

const loadDataList = async ()=> {
    let params = {
        pageNo: tableData.value.pageNo,
        pageSize: tableData.value.pageSize,
        fileNameFuzzy: fileNameFuzzy.value,
        filePid: currentFolder.value.fileId,
        category: category.value,
    }
    if (params.category !== 'all') {
        delete params.filePid
    }
    let result = await proxy.Request({
        url: api.loadDataList,
        params: params,
        showLoading: false,
    })
    
    if (!result) {
        return
    }
    tableData.value = result.data
}
//展示操作按钮
const showOp = (row) => {
  tableData.value.list.forEach((element) => {
    element.showOp = false;
  });
  row.showOp = true;
};

const cancelShowOp = (row) => {
  row.showOp = false;
}

//多选 批量选择
const selectFileIdList = ref([])
const selectFileList = ref([])

const rowSelected = (rows) => {
  selectFileList.value = rows
  selectFileIdList.value = []
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId)
  })
}

// 预览文件
const preview = (row)=>{
    if (row.folderType == 1) {//如果是目录，选择打开
        navigationRef.value.openFolder(row);
        return;
    }
}

//保存文件名编辑
const saveNameEdit = async (index) => {
    const { fileId, filePid, fileNameReal } = tableData.value.list[index];
    if (fileNameReal == "" || fileNameReal.indexOf("/") != -1) {
        proxy.Message.warning("文件名不能为空且不能含有斜杠");
        return;
    }
    let url = api.rename;
    if (fileId == "") {
        url = api.newFoloder;
    }
    let result = await proxy.Request({
        url: url,
        params: {
        fileId: fileId,
        filePid: filePid,
        fileName: fileNameReal,
        },
    });
    if (!result) {
        return;
    }
    tableData.value.list[index] = result.data;//这里已经将showEdit属性去除了
    editing.value = false;
}
//取消文件名编辑
const cancelNameEdit = (index) => {
    const fileData = tableData.value.list[index];
    if (fileData.fileId) {//取消编辑的是 已存在的文件
        fileData.showEdit = false;
    } else {//取消编辑的是 新建的目录
        tableData.value.list.splice(index, 1);
    }
    editing.value = false;
}
//分享文件
const share = () => {

}
//下载文件
const download = () => {

}
//删除文件
const delFile = (row) => {
    proxy.Confirm(`你确定要删除${row.fileName}吗？删除的文件可在10天内通过回收站还原`, async () => {
        let result = await proxy.Request({
            url: api.delFile,
            params: {
                fileIds: row.fileId,
            }
        })
        if (!result) {
            return
        }
        proxy.Message.success("删除文件成功")
        loadDataList()
    })
}

//编辑行
const editing = ref(false);//表示是否在编辑状态
const editNameRef = ref();//引用editPanel

//编辑文件名
const editFileName = (index)=> {
    if (tableData.value.list[0].fileId == "") {//点击了新建文件夹之后，又重新编辑其它文件名
        tableData.value.list.splice(0, 1);
        index = index - 1;
    }
    tableData.value.list.forEach((element) => {
        element.showEdit = false;
    });
    let cureentData = tableData.value.list[index];
    cureentData.showEdit = true;

    //编辑文件
    if (cureentData.folderType == 0) {
        cureentData.fileNameReal = cureentData.fileName.substring(0,cureentData.fileName.indexOf("."));
        cureentData.fileSuffix = cureentData.fileName.substring(cureentData.fileName.indexOf("."));
    } else {//编辑目录
        cureentData.fileNameReal = cureentData.fileName;
        cureentData.fileSuffix = "";
    }
    editing.value = true;
    // editNameRef.value.focus();
}

//移动文件
const folderSelectRef = ref()
const currentMoveFile = ref({})//当前选择移动的文件
const moveFolder = (row) => {
    currentMoveFile.value = row
    let excludeFileIdList = [currentFolder.value.fileId]
    if (row.folderType == "1") {//row本身为目录
        excludeFileIdList.push(row.fileId)
    }
    folderSelectRef.value.showFolderDialog(excludeFileIdList.join(','))
}

//移动文件完成
const moveFolderDone = async (folderId) =>{
    if (currentMoveFile.value.filePid === folderId || currentFolder.value.fileId == folderId) {
        proxy.Message.warning("文件正在当前目录，无需移动");
        return;
    }
    let filedIdsArray = [];
    if (currentMoveFile.value.fileId) {
        filedIdsArray.push(currentMoveFile.value.fileId);
    } else {
        filedIdsArray = filedIdsArray.concat(selectFileIdList.value);
    }
    let result = await proxy.Request({
        url: api.changeFileFolder,
        params: {
        fileIds: filedIdsArray.join(","),
        filePid: folderId,
        },
    });
    if (!result) {
        return;
    }
    folderSelectRef.value.close();
    loadDataList()
}
</script>

<style lang="scss" scoped>
@import "@/assets/file.list.scss";
</style>