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
                <el-button type="success">
                    <span class="iconfont icon-folder-add"></span>
                    新建文件夹
                </el-button>
                <el-button type="danger">
                    <span class="iconfont icon-del"></span>
                    批量删除
                </el-button>
                <el-button type="warning">
                    <span class="iconfont icon-move"></span>
                    批量移动
                </el-button>
                <div class="search-panel">
                    <el-input clearable placeholder="输入文件名搜索">
                        <template #suffix>
                            <i class="iconfont icon-search" @click="search"></i>
                        </template>
                    </el-input>
                </div>
                <div class="iconfont icon-refresh" @click="loadDataList"></div>
            </div>
            <!-- 导航 -->
             <div>全部文件</div>
        </div>
        <div class="file-list">
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
    </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance} from 'vue'
const {proxy} = getCurrentInstance()

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
const category = ref("all")
const loadDataList = async ()=> {
    let params = {
        pageNo: tableData.value.pageNo,
        pageSize: tableData.value.pageSize,
        fileNameFuzzy: fileNameFuzzy.value,
        filePid: 0,
        category: category.value,
    }
    console.log(params)
    if (params.category !== 'all') {
        delete params.filePid
    }
    let result = await proxy.Request({
        url: api.loadDataList,
        params: params,
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
};

const rowSelected = ()=> {}

</script>

<style lang="scss" scoped>
@import "@/assets/file.list.scss";
</style>