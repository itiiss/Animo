<template>
  <div ref="rootNodeRef" v-show="!isHidden">
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
import { addChildNode, removeNode, render, toggleNodeDisplay } from "@/libs/x6";

const store = useStore();
const node = inject<() => Node>("getNode")?.() as Node;
const graph = inject<() => Graph>("getGraph")?.() as Graph;
const labelText = ref(node.getData().label ?? "");
const isHidden = ref(node.getData().hidden ?? false);

console.log("visibility", node.getData());

const rootNodeRef = ref();
const isHovered = useElementHover(rootNodeRef);

const addChild = () => {
  console.log("addChild", graph);
  const id = node?.id;
  const type = node?.prop("type");
  if (addChildNode(id, type, store.$state.mindMap)) {
    render(graph, store.$state.mindMap);
  }
};

const toggleCollapsed = () => {
    console.log('getData', node.getData())
    toggleNodeDisplay(node.id, !isHidden.value, store.$state.mindMap);
    render(graph, store.$state.mindMap);
};



const deleteNode = () => {
    if (removeNode(node?.id, store.$state.mindMap)) {
        render(graph, store.$state.mindMap);
    }
};

watchEffect(() => {
    console.log('effect', node.getData().hidden)
    isHidden.value = node.getData().hidden;
})

watchEffect(() => {
  // labelText.value
  node?.setData({ label: labelText.value });
});
</script>

<style></style>
