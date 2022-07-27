import { Graph, Cell, Node, Path, Shape } from '@antv/x6';
import Hierarchy from '@antv/hierarchy';
import { ref, onMounted, onUnmounted, Ref } from 'vue';
import { HierarchyResult, MindMapData, NodeType } from '@/types';
import RootNode from '../components/RootNode.vue'
import '@antv/x6-vue-shape'
import { addChildNode, render, removeNode } from '@/libs/x6';
import { useStore } from '@/store';

function useMind(nodeRef: Ref) {

    const store = useStore();
    const data = store.$state.mindMap;

	onMounted(() => {
		const graph = new Graph({
			container: nodeRef.value,
            width: 1200,
            height: 800,
			connecting: {
				connectionPoint: 'anchor',
			},
			selecting: {
				enabled: true,
			},
			keyboard: {
				enabled: true,
			},
		});

		graph.bindKey(['backspace', 'delete'], () => {
			const selectedNodes = graph
				.getSelectedCells()
				.filter(item => item.isNode());
			if (selectedNodes.length) {
				const { id } = selectedNodes[0];
				if (removeNode(id, data)) {
                    render(graph, data);
				}
			}
		});

		graph.bindKey('tab', e => {
			e.preventDefault();
			const selectedNodes = graph
				.getSelectedCells()
				.filter(item => item.isNode());
			if (selectedNodes.length) {
				const node = selectedNodes[0];
				const type = node.prop('type');
				if (addChildNode(node.id, type, data)) {
                    render(graph, data);
				}
			}
		});

        render(graph, data);
	});
}

export default useMind;
