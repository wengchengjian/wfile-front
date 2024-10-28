<script setup lang="tsx">
import { TableInstance } from "element-plus";
import { DraggableEvent } from "vue-draggable-plus";
import useFileStore from "~/stores/file";

import { fileTypeMap } from "~/stores/types";

const fileStore = useFileStore();
const multipleSelection = ref([]);
const { searching, total, tableData } = fileStore.getTableData();
const multipleTableRef = ref<TableInstance>();

const fileTypesIcon = {
  dir: {
    type: "dir",
    src: "/dir.svg",
  },
  file: {
    type: "file",
    src: "/file.svg",
  },
  video: {
    type: "video",
    src: "/video.svg",
  },
  image: {
    type: "image",
    src: "/picture.svg",
  },
};

function bytesToSize(bytes: number) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;

  console.log("selectionChange", val);
};

const handleDownload = async (id: number) => {
  fileStore.download([id]);
};

const handleDownloadBatch = async (ids: number[]) => {
  fileStore.download(ids);
};

const handleSizeChange = (val: number) => {
  fileStore.pageSize = val;
  fileStore.getTableData();
};
const handleCurrentChange = (val: number) => {
  fileStore.pageNo = val;
  fileStore.getTableData();
};

const notDragging = ref(false);

const copyContent = (text: string) => {
  navigator.clipboard.writeText(text);
  ElMessage.success("复制成功");
};

const moveDraggableElement = (e: DraggableEvent) => {
  console.log(e);
};

const handleMoveFile = (a, b) => {
  fileStore.api.move(a.id, a.fileName, b.id);
  fileStore.getTableData();
};
let draggedElement = null;
let droppedOnElement = null;

onUpdated(() => {
  setTimeout(() => {
    const body = document.querySelector("body");
    body.addEventListener("dragenter", (e) => {
      e.preventDefault();
      fileStore.fileUploadDialogVisible = true;
    });
    let list = document.querySelectorAll(".file-row-class");
    for (let i = 0; i < list.length; i++) {
      list[i].setAttribute("draggable", "true");
      const handleDragStart = (e) => {
        draggedElement = tableData.value[i];
      };
      const handleDragOver = (e) => {
        e.preventDefault();

        droppedOnElement = tableData.value[i];
      };
      list[i].removeEventListener("dragstart", handleDragStart);
      list[i].addEventListener("dragstart", handleDragStart);
      list[i].removeEventListener("dragover", handleDragOver);
      list[i].addEventListener("dragover", handleDragOver);
    }
  }, 500);
});

const handleDrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  console.log(files);
  if (droppedOnElement.fileType != "dir") {
    ElMessage({ type: "warning", message: "请将文件拖到文件夹上" });
    return;
  }
  if (draggedElement == null || droppedOnElement == null) {
    console.log("draggedElement or droppedOnElement is null");
    return;
  }
  handleMoveFile(draggedElement, droppedOnElement);
};
</script>

<template>
  <TheUploadFileDialog />
  <div class="file-box">
    <div my-3 pt-3 px-5 bg-white>
      <el-form inline>
        <el-form-item>
          <el-input
            size="large"
            v-model="fileStore.searchFileName"
            placeholder="请输入搜索文件名"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            size="large"
            v-model="fileStore.searchMd5"
            placeholder="请输入搜索md5"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            size="large"
            multiple
            collapse-tags
            v-model="fileStore.searchFileTypes"
            placeholder="请选择文件类型"
            clearable
            style="min-width: 240px"
          >
            <el-option
              v-for="[key, value] in fileTypeMap"
              :key="key"
              :label="key"
              :value="key"
            >
              <span style="float: left">{{ value }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
              >
                {{ key }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            style="background-color: #15ac91"
            type="primary"
            @click="fileStore.getTableData"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table
      @drop="handleDrop"
      row-key="id"
      row-class-name="file-row-class"
      v-loading="searching"
      element-loading-text="数据加载中..."
      size="large"
      ref="multipleTableRef"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column resizable prop="fileName" label="文件名">
        <template #default="scope">
          <el-space>
            <template v-if="fileTypesIcon[scope.row.fileType] != null">
              <el-image class="icon-style" :src="fileTypesIcon[scope.row.fileType].src" />
            </template>
            <el-popover
              show-arrow
              placement="top-start"
              :width="100"
              trigger="hover"
              :content="scope.row.fileName"
              v-if="scope.row.fileName.length > 20 && notDragging"
            >
              <template #reference>
                <el-text w-150px truncated>
                  {{ scope.row.fileName }}
                </el-text>
              </template>
            </el-popover>
            <el-text v-else w-150px truncated>
              {{ scope.row.fileName }}
            </el-text>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小">
        <template #default="scope">
          <template v-if="scope.row.fileType == 'dir'"> - </template>
          <template v-else>
            <el-text>{{ bytesToSize(scope.row.fileSize) }}</el-text>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="fileType" label="文件类型">
        <template #default="scope">
          {{ fileTypeMap.get(scope.row.fileType) }}
        </template>
      </el-table-column>
      <el-table-column prop="MD5" label="MD5">
        <template #default="scope">
          <el-text @dblclick="copyContent(scope.row.md5)" truncated>
            {{ scope.row.md5 }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column sortable prop="updateTime" label="修改时间">
        <template #default="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>

      <el-table-column sortable prop="operation" label="操作">
        <template #default="scope">
          <el-space>
            <el-text
              v-if="scope.row.fileType != 'dir'"
              class="operation-class"
              type="warning"
              @click="handleDownload(scope.row.id)"
            >
              下载
            </el-text>
            <el-text
              v-if="scope.row.fileType != 'dir'"
              class="operation-class"
              type="danger"
              @click="fileStore.deleteBatchByIds([scope.row.id])"
            >
              删除
            </el-text>
          </el-space>
        </template>
      </el-table-column>

      <template #empty>
        <el-skeleton :rows="5" />
      </template>
    </el-table>

    <el-pagination
      my-3
      hide-on-single-page
      v-model:current-page="fileStore.pageNo"
      :page-size="fileStore.pageSize"
      size="large"
      layout="prev, pager, next, total"
      :total="fileStore.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="css" scoped>
.icon-style {
  width: 25px;
  height: 30px;
}
.operation-class {
  cursor: pointer;
}

.file-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drag-box {
  width: 100%;
}
</style>
