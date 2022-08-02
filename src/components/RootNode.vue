<template>
  <div ref="rootNodeRef" class="flex" @dblclick="enableEdit">
    <input
      type="text"
      tabindex="-1"
      :id="node.id"
      :value="store.getTextByID(node.id)"
      @input="onTextChange"
      :disabled="!store.getEditByID(node.id)"
      :placeholder="store.getTextByID(node.id)"
      class="input-back input-ghost input-primary w-full max-w-xs h-8 focus: border-none outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { Graph, Node } from "@antv/x6";
import { useStore } from "@/store";

const store = useStore();
const node = inject<() => Node>("getNode")?.() as Node;
const graph = inject<() => Graph>("getGraph")?.() as Graph;

const rootNodeRef = ref();
const isHovered = useElementHover(rootNodeRef);

const enableEdit = () => {
  store.modifyCurrentID(node.id);
};

const onTextChange = (e: Event) => {
  const target = <HTMLInputElement>e.target;
  store.modifyTextByID(node.id, target.value);
};

watchEffect(() => {
  node?.resize(store.getTextWidthById(node.id) + 40, 30);
});
</script>

<style></style>
