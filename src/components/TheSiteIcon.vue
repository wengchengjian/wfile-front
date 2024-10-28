<script setup lang="ts">

</script>

<template>
  <el-row class="logo" justify-between align-mid>
    <el-col :span="12">
      <el-image class="icon" src="/logo.jpg" fit="fill" />
    </el-col>
    <el-col :span="12" flex justify-between align-mid>
      <el-text type="warning" size="large">
        WFILE
      </el-text>
    </el-col>
  </el-row>
</template>

<style lang='css' scoped>
   .logo {
    width: 190px;
    height: 50px;
   }

   .icon {
    width: 90px;
    height: 50px;
   }
</style>
