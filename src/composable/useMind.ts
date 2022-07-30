import { Graph, Cell, Node, Path, Shape, DataUri } from '@antv/x6';
import Hierarchy from '@antv/hierarchy';
import {
	ref,
	onMounted,
	onUnmounted,
	Ref,
	VNode,
	RendererNode,
	RendererElement,
} from 'vue';
import { HierarchyResult, MindMapData, NodeType } from '@/types';
import RootNode from '../components/RootNode.vue';
import '@antv/x6-vue-shape';
import { addChildNode, render, removeNode } from '@/libs/x6';
import { ROOT_NODE_ID, useStore } from '@/store';

function useMind(nodeRef: Ref) {
	const store = useStore();
	const data = store.$state.mindMap;
	const graphInstance = ref();

	const exportJSON = () => {
		const content = graphInstance.value.toJSON();
		const link = document.createElement('a');
		link.download = 'config.json';
		link.href = 'data:text/plain,' + JSON.stringify(content);
		link.click();
	};

	const exportPNG = () => {
		graphInstance.value.toPNG((dataUri: string) => {
			DataUri.downloadDataUri(dataUri, 'chart.png');
		});
	};

	const zoomIn = () => {
		graphInstance.value.zoomTo(graphInstance.value.zoom() + 0.1);
	};

	const zoomOut = () => {
		graphInstance.value.zoomTo(graphInstance.value.zoom() - 0.1);
	};

	const zoomToFit = () => {
		graphInstance.value.zoomToFit();
	};

	const scrollToCenter = () => {
		graphInstance.value.scrollToContent();
	};

	const { width: windowWidth, height: windowHeight } = useWindowSize();

	onMounted(() => {
		const graph = new Graph({
			container: nodeRef.value,
			width: windowWidth.value,
			height: windowHeight.value - 200,
			scroller: {
				enabled: true,
				pannable: true,
				pageVisible: true,
				pageBreak: false,
			},
			mousewheel: {
				enabled: true,
				modifiers: ['ctrl', 'meta'],
			},
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

		graphInstance.value = graph;

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

		// graph.on('node:mouseenter', ({ node }) => {
		// 	console.log('mouseenter', node)

		// 	node.addTools({
		// 		name: 'button',
		// 		args: {
		// 			markup: 'xxx',
		// 			x: 0,
		// 			y: 0,
		// 			offset: { x: 10, y: 10 },
		// 		},
		// 	})
		// })

		// // 鼠标移开时删除按钮
		// graph.on('node:mouseleave', ({ node }) => {

		// 	// node.removeTools()
		// })

		graph.on('node:mouseenter', ({ node }) => {
			console.log('removenode', node);
			if (node.id !== ROOT_NODE_ID) {
				node.addTools([
					{
						name: 'button-remove',
						args: {
							x: 10,
							y: 10,
							onClick: () => {
								if (
									removeNode(node?.id, store.$state.mindMap)
								) {
									render(graph, store.$state.mindMap);
								}
							},
						},
					},
					// {
					// 	name: 'button',
					// 	args: {
					// 		markup: [
					// 			{
					// 				tagName: 'circle',
					// 				selector: 'button',
					// 				attrs: {
					// 					r: 14,
					// 					stroke: '#fe854f',
					// 					'stroke-width': 3,
					// 					fill: 'white',
					// 					cursor: 'pointer',
					// 				},
					// 			},
					// 			{
					// 				tagName: 'text',
					// 				textContent: '+',
					// 				selector: 'icon',
					// 				attrs: {
					// 					fill: '#fe854f',
					// 					'font-size': 8,
					// 					'text-anchor': 'middle',
					// 					'pointer-events': 'none',
					// 					y: '0.3em',
					// 				},
					// 			},
					// 		],
					// 		x: '100%',
					// 		y: '100%',
					// 		offset: { x: -18, y: -18 },
					// 		onClick() {
					// 			if (
					// 				addChildNode(
					// 					node.id,
					// 					node?.prop('type'),
					// 					store.$state.mindMap
					// 				)
					// 			) {
					// 				render(graph, store.$state.mindMap);
					// 			}
					// 		},
					// 	},
					// },
				]);
			}
			// node.addTools([
			// 	{
			// 		name: 'button-remove',
			// 		args: {
			// 			x: 10,
			// 			y: 10,
			// 			onClick: () => {
			// 				if (removeNode(node?.id, store.$state.mindMap)) {
			// 					render(graph, store.$state.mindMap);
			// 				}
			// 			},
			// 		},
			// 	},
			// ]);
		});

		graph.on('node:mouseleave', ({ node }) => {
			// if (node.hasTool('button-remove')) {
			// 	node.removeTool('button-remove');
			// }
			node.removeTools();
		});

		render(graph, data);
	});

	watchEffect(() => {
		console.log('effect', windowWidth.value, windowHeight.value);
		graphInstance.value?.resize(windowWidth.value, windowHeight.value);
		graphInstance.value?.resizeGraph(
			windowWidth.value * 2,
			windowHeight.value * 2
		);
		graphInstance.value?.scrollToContent();
	});

	return {
		graphInstance,
		exportPNG,
		exportJSON,
		zoomToFit,
		zoomIn,
		zoomOut,
		scrollToCenter,
	};
}

export default useMind;
