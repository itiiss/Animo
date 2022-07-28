<script setup lang="ts">
import useMind from "@/composable/useMind";
import { ref, VNode } from "vue";
import { Graph, DataUri } from "@antv/x6";
useHead({
  title: "Other Pages",
});

const mindNode = ref<VNode>();
const { zoomIn, zoomOut, zoomToFit, scrollToCenter, exportJSON, exportPNG } = useMind(
  mindNode
);
</script>

<template>
  <div>
    <!-- <p>{{ $t("pages.other.desc") }}</p> -->
    <div class="flex flex-1 gap-5">
      <button class="flex-1" @click="exportJSON">Export JSON</button>
      <button class="flex-1" @click="exportPNG">Export PNG</button>
      <button class="flex-1" @click="zoomToFit">Zoom To Fit</button>
      <button class="flex-1" @click="scrollToCenter">scrollToCenter</button>
      <button class="flex-1" @click="zoomIn">ZoomIn</button>
      <button class="flex-1" @click="zoomOut">zoomOut</button>
    </div>
    <div ref="mindNode"></div>
    <router-link
      :to="{ name: 'home' }"
      class="mt-5 hover:text-gray-200 dark:hover:text-gray-500 hover:underline"
      >{{ $t("pages.home") }}</router-link
    >
  </div>
</template>

<style scoped></style>

<route lang="yaml">
name: other-page
</route>
