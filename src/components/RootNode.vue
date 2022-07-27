<template>
  <div ref="rootNodeRef">
    <input class="w-full rounded-lg" type="text" v-model="labelText" />
    <button class="absolute top-2" v-show="isHovered" @click="addChild">➕</button>
    <button class="absolute top-2 right-1" v-show="isHovered" @click="toggleCollapsed">
      ➖
    </button>
    <button class="absolute bottom-6" v-show="isHovered" @click="deleteNode">✖️</button>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, defineProps } from "vue";
import { Graph, Node } from "@antv/x6";
import { MindMapData } from "@/types";
import { useStore } from "@/store";
import { addChildNode, removeNode, toggleNodeCollapsed, render, findItem } from "@/libs/x6";

const store = useStore();
const node = inject<() => Node>("getNode")?.() as Node;
const graph = inject<() => Graph>("getGraph")?.() as Graph;
const labelText = ref(node.getData().label ?? "");
const isHiddenSuccessor = ref(node.getData().isHiddenSuccessor ?? false);

const rootNodeRef = ref();
const isHovered = useElementHover(rootNodeRef);

const addChild = () => {
  const id = node?.id;
  const type = node?.prop("type");
  if (addChildNode(id, type, store.$state.mindMap)) {
    render(graph, store.$state.mindMap);
  }
};

const toggleCollapsed = () => {
  toggleNodeCollapsed(node, graph, isHiddenSuccessor.value);
  isHiddenSuccessor.value = !isHiddenSuccessor.value;
};

const deleteNode = () => {
  if (removeNode(node?.id, store.$state.mindMap)) {
    render(graph, store.$state.mindMap);
  }
};


watchEffect(() => {
  // labelText.value
  node?.setData({ label: labelText.value });
});
</script>

<style></style>
