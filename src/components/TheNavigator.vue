<script setup lang="ts">
const tags = $ref(['全部', '最近', '视频', '图片', '文档'])

const activeTab = $ref('全部')

const handleClickTab = (tag: string) => {
  console.log(tag)
}
</script>

<template>
  <el-tabs v-model="activeTab" @tab-click="handleClickTab">
    <el-tab-pane v-for="tag in tags" :key="tag" :label="tag">
      {{ tag }}
    </el-tab-pane>
  </el-tabs>
</template>
