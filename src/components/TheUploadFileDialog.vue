<script setup lang="ts">
import { UploadFile, UploadFiles, UploadProps, UploadUserFile } from "element-plus";
import SparkMD5 from "spark-md5";
import useFileStore from "~/stores/file";
import useSocketStore from "~/stores/websocket";
import { UploadFilled } from "@element-plus/icons-vue";

const socket = useSocketStore();

const fileList = ref<UploadUserFile[]>([]);
const fileMd5s = reactive<Map<String, String>>(new Map());
const fileStore = useFileStore();
const { fileUploadDialogVisible } = toRefs(fileStore);

watch(fileUploadDialogVisible, () => {
  fileList.value = [];
  socket.progressMap.clear();
});

const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 1024) {
    ElMessage.error("文件不能超过1GB!");
    return false;
  }

  return true;
};

const handleUploadFiles = () => {
  const files = fileList.value.map((item) => item.raw);
  const md5s = Array.from(fileMd5s.values());
  if (files.length != 0) {
    fileStore.api.uploadFull(fileStore.dirId, md5s, files);
    // 发送文件上传消息
    socket.sendFileUploadMsg();
  }
};

const handleUploadFilesChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 去除重复
  if (uploadFiles.length >= 1) {
    if (uploadFiles.filter((item) => item.name == uploadFile.name).length > 1) {
      ElMessage.error("文件已存在");
      uploadFiles.splice(uploadFiles.indexOf(uploadFile), 1);
    }
  }

  if (!fileMd5s.has(uploadFile.name)) {
    const fileReader = new FileReader();
    fileReader.readAsText(uploadFile.raw);
    fileReader.onload = (e) => {
      let md5 = SparkMD5.hashBinary(e.target?.result);
      fileMd5s.set(uploadFile.name, md5);
    };
  }
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 10, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};
</script>

<template>
  <div class="file-upload-box">
    <el-dialog
      destroy-on-close
      v-model="fileStore.fileUploadDialogVisible"
      title="文件上传"
      :width="800"
    >
      <el-upload
        v-model:file-list="fileList"
        class="upload-box"
        multiple
        show-file-list
        drag
        :on-change="handleUploadFilesChange"
        :auto-upload="false"
        :limit="10"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖拽文件到<em>此处上传</em></div>
        <template #file="{ file }">
          <div flex my-5 class="progress-box">
            <el-text>
              {{ file.name }}
            </el-text>
            <el-progress :percentage="socket.getProgress(file.name)"> </el-progress>
          </div>
        </template>
        <template #tip>
          <div class="el-upload__tip">请将文件拖到区域内</div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="fileStore.fileUploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUploadFiles"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
