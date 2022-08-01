<template>
  <div ref="rootNodeRef" @dblclick="enableEdit">
    <input
      type="text"
      tabindex="-1"
      :value="store.getTextByID(node.id)"
      @input="onTextChange"
      :disabled="!store.getEditByID(node.id)"
      placeholder="Type here"
      class="input-back input-ghost input-primary w-full max-w-xs h-8 focus: border-none outline-none"
    />
    <button
      class="absolute top-0 btn-square btn-xs"
      tabindex="-1"
      v-show="isHovered"
      @click="addChild"
    >
      ➕
    </button>
    <button
      class="absolute top-2 btn-square btn-xs rounded-md btn-ghost"
      v-show="isHovered"
      @click="toggleCollapsed"
      tabindex="-1"
    >
      {{ store.getCollapsedById(node.id) ? "➕" : "➖" }}
    </button>
    <!-- <button class="absolute bottom-6" v-show="isHovered" @click="deleteNode">✖️</button> -->
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, defineProps } from "vue";
import { Graph, Node } from "@antv/x6";
import { useStore } from "@/store";
import { addChildNode, toggleNodeCollapsed, render } from "@/libs/x6";

const store = useStore();
const node = inject<() => Node>("getNode")?.() as Node;
const graph = inject<() => Graph>("getGraph")?.() as Graph;

const rootNodeRef = ref();
const isHovered = useElementHover(rootNodeRef);

const enableEdit = () => {
  store.toggleEditByID(node.id, !store.getEditByID(node.id));
};

const onTextChange = (e: Event) => {
  const target = <HTMLInputElement>e.target;
  store.modifyTextByID(node.id, target.value);
};

const addChild = () => {
  if (addChildNode(node.id, store.$state.mindMap)) {
    render(graph, store.$state.mindMap);
  }
};

const toggleCollapsed = () => {
  toggleNodeCollapsed(node, graph, store.getCollapsedById(node.id));
  store.toggleCollapsedByID(node.id, !store.getCollapsedById(node.id));
};

// const deleteNode = () => {
//   if (removeNode(node?.id, store.$state.mindMap)) {
//     render(graph, store.$state.mindMap);
//   }
// };

watchEffect(() => {
  node?.resize(store.getTextWidthById(node.id) + 40, 30);
});
</script>

<style></style>
