<template>
  <main class="text-center text-gray-700 dark:text-gray-200">
    <el-row justify-between class="header-style">
      <el-col :span="2">
        <!-- 网站图标 -->
        <TheSiteIcon />
      </el-col>
      <el-col :span="14"> </el-col>
      <el-col :span="2">
        <!-- 登录注册 -->
        <TheLoginAndRegister />
      </el-col>
      <el-col :span="2">
        <!-- 设置 -->
        <TheSettings />
      </el-col>
      <el-col :span="4">
        <!-- 其他功能 -->
        <TheOthers />
      </el-col>
    </el-row>
    <el-row justify-center>
      <el-col :span="12" mt-10>
        <RouterView />
      </el-col>
    </el-row>

    <el-row justify-between>
      <el-col>
        <TheFooter />
      </el-col>
    </el-row>
    <div class="mt-5 mx-auto text-center opacity-75 dark:opacity-50 text-sm">
      [Default Layout]
    </div>
  </main>
</template>

<style lang="css">
body {
  background-color: #f3f4f6;
}

.header-style {
  background-color: #fff;
}
</style>
