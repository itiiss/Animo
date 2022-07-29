<script setup lang="ts">
import useMind from "@/composable/useMind";
import { ref, VNode } from "vue";
import { Graph, DataUri } from "@antv/x6";
import exportfile from "@/assets/exportfile.svg";
import exportpng from "@/assets/exportpng.svg";
import fit from "@/assets/fit.svg";
import zoomout from "@/assets/zoomin.svg";
import zoomin from "@/assets/zoomout.svg";
import location from "@/assets/location.svg";

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
    <div ref="mindNode"></div>
    <div class="flex fixed bottom-5 right-5 bg-base-300 rounded-md">
      <div class="btn-group flex flex-0">
        <button class="btn btn-ghost btn-square" @click="scrollToCenter">
          <img :src="location" />
        </button>
        <button class="btn btn-ghost btn-square" @click="zoomIn">
          <img :src="zoomin" />
        </button>
        <button class="btn btn-ghost btn-square" @click="zoomOut">
          <img :src="zoomout" />
        </button>
        <button class="btn btn-ghost btn-square" @click="zoomToFit">
          <img :src="fit" />
        </button>
      </div>
      <div class="divider divider-horizontal m-0"></div>
      <div class="btn-group flex flex-0">
        <button class="btn btn-ghost btn-square" @click="exportJSON">
          <img :src="exportfile" />
        </button>
        <button class="btn btn-ghost btn-square" @click="exportPNG">
          <img :src="exportpng" />
        </button>
      </div>
    </div>
    <!-- <router-link
      :to="{ name: 'home' }"
      class="mt-5 hover:text-gray-200 dark:hover:text-gray-500 hover:underline"
      >{{ $t("pages.home") }}</router-link
    > -->
  </div>
</template>

<style scoped></style>

<route lang="yaml">
name: other-page
</route>
