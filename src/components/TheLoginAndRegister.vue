<script setup lang="ts">
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { DefaultApi } from "~/api";
import useFileStore from "~/stores/file";

let loginDialogVisible = $ref(false);
const api = new DefaultApi();

interface RuleForm {
  username: string;
  password: string;
}

const userStore = useUserStore();
const fileStore = useFileStore();
const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules<RuleForm>>({
  username: {
    required: true,
    message: "请输入用户名",
  },
  password: {
    required: true,
    message: "请输入密码",
  },
});

const loginForm = reactive({
  username: "",
  password: "",
});

const handleClickLogin = () => {
  loginDialogVisible = true;
};

const cancelDialog = () => {
  loginDialogVisible = false;
};

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const userInfo = await api.login(loginForm.username, loginForm.password);
      userStore.refresh(userInfo);
      fileStore.getTableData();
      cancelDialog();
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<template>
  <el-space :style="{ width: '100%', height: '100%' }">
    <el-button v-if="!userStore.isLogin" @click="handleClickLogin"> 登录 </el-button>
    <div v-else>
      <el-dropdown placement="bottom">
        <el-avatar
          class="avatar-style"
          size="large"
          :src="userStore.avatar ? userStore.avatar : '/th.jpg'"
          :alt="userStore.nickname"
        >
        </el-avatar>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="userStore.logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="loginDialogVisible" title="登录界面" width="500">
      <el-form ref="ruleFormRef" :model="loginForm" :rules="rules" label-width="auto">
        <el-form-item label="用户名:" prop="username">
          <el-input clearable v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input type="password" clearable v-model="loginForm.password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialog"> Cancel </el-button>
          <el-button @click="submit(ruleFormRef)"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </el-space>
</template>

<style lang="css" scope>
.avatar-style {
  cursor: pointer;
}
</style>
