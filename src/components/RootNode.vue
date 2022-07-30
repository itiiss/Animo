<template>
  <div ref="rootNodeRef">
    <input
      type="text"
      v-model="labelText"
      placeholder="Type here"
      class="input-back input-ghost input-primary w-full max-w-xs h-8 focus: border-none outline-none"
    />
    <button class="absolute top-0 btn-square btn-xs" v-show="isHovered" @click="addChild">
      ➕
    </button>
    <button
      class="absolute top-2 btn-square btn-xs rounded-md btn-ghost"
      v-show="isHovered"
      @click="toggleCollapsed"
    >
      {{ isHiddenSuccessor ? "➕" : "➖" }}
    </button>
    <!-- <button class="absolute bottom-6" v-show="isHovered" @click="deleteNode">✖️</button> -->
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, defineProps } from "vue";
import { Graph, Node } from "@antv/x6";
import { MindMapData } from "@/types";
import { useStore } from "@/store";
import {
  addChildNode,
  removeNode,
  toggleNodeCollapsed,
  render,
  findItem,
} from "@/libs/x6";
import useTextWidth from "@/composable/useTextWidth";

const store = useStore();
const node = inject<() => Node>("getNode")?.() as Node;
const graph = inject<() => Graph>("getGraph")?.() as Graph;
const labelText = ref(node.getData().label ?? "");
const isHiddenSuccessor = ref(node.getData().isHiddenSuccessor ?? false);

const labelTextWidth = useTextWidth(labelText);

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

// const deleteNode = () => {
//   if (removeNode(node?.id, store.$state.mindMap)) {
//     render(graph, store.$state.mindMap);
//   }
// };

watchEffect(() => {
  node?.setData({ label: labelText.value });

  node?.resize(labelTextWidth.value + 40, 30);
});
</script>

<style></style>
