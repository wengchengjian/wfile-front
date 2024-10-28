<script setup lang="ts">
defineOptions({
  name: "IndexPage",
});
const user = useUserStore();
const name = $ref(user.savedName);

const router = useRouter();

const { t } = useI18n();
</script>

<template>
  <TheFileView />
</template>
