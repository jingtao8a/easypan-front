<template>
  <div class="pdf">
    <vue-pdf-embed
      ref="pdfRef"
      :source="state.url"
      class="vue-pdf-embed"
      width="850"
      :page="state.pageNum"
      :style="scaleFun"
    />
  </div>
</template>

<script setup>
import VuePdfEmbed from "vue-pdf-embed";

import { ref, computed } from "vue";

const props = defineProps({
  url: {
    type: String,
  },
});
const scaleFun = computed(() => {
  return "transform:scale(${state.scale})";
});

const state = ref({
  url: "", // 预览pdf文件地址
  pageNum: 0, // 当前页面
  numPages: 0, // 总页数
});

const init = () => {
  const url = "/api" + props.url;
  state.value.url = url;
};

init();
</script>

<style lang="scss" scoped>
.pdf {
  width: 100%;
}
</style>