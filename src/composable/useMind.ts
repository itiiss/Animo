import { Graph, DataUri, View } from '@antv/x6';
import Hierarchy from '@antv/hierarchy';
import { ref, onMounted, Ref } from 'vue';
import '@antv/x6-vue-shape';
import {
	addChildNode,
	render,
	removeNode,
	addSiblingNode,
	traverseAndModify,
	getParentID,
	getChildID,
	getPrevSiblingID,
	getNextSiblingID,
	findItem,
	toggleNodeCollapsed,
} from '@/libs/x6';
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
				if (addChildNode(node.id, data)) {
					render(graph, data);
				}
			}
		});

		graph.bindKey('enter', e => {
			e.preventDefault();
			const selectedNodes = graph
				.getSelectedCells()
				.filter(item => item.isNode());
			if (selectedNodes.length) {
				const node = selectedNodes[0];
				if (addSiblingNode(node.id, data)) {
					render(graph, data);
				}
			}
		});

		graph.bindKey('space', e => {
			e.preventDefault();
			const selectedNodes = graph
				.getSelectedCells()
				.filter(item => item.isNode());
			if (selectedNodes.length) {
				const node = selectedNodes[0];
				store.modifyCurrentID(node.id);
			}
		});


		graph.bindKey('left', e => {
			e.preventDefault();
			const currentNodeID = store.$state.currentID;
			const parentId = getParentID(store.$state.mindMap, currentNodeID);
			store.modifyCurrentID(parentId);
		});

		graph.bindKey('right', e => {
			e.preventDefault();
			const currentNodeID = store.$state.currentID;
			const childID = getChildID(store.$state.mindMap, currentNodeID);
			store.modifyCurrentID(childID);
		});

		graph.bindKey('up', e => {
			e.preventDefault();
			const currentNodeID = store.$state.currentID;
			const preSiblingID = getPrevSiblingID(
				store.$state.mindMap,
				currentNodeID
			);
			store.modifyCurrentID(preSiblingID);
		});

		graph.bindKey('down', e => {
			e.preventDefault();
			const currentNodeID = store.$state.currentID;
			const nextSiblingID = getNextSiblingID(
				store.$state.mindMap,
				currentNodeID
			);
			store.modifyCurrentID(nextSiblingID);
		});

		graph.on('node:mouseenter', ({ node }) => {
			if (node.id !== ROOT_NODE_ID) {
				node.addTools([
					{
						name: 'button-remove',
						args: {
							x: 10,
							y: 2,
							onClick: () => {
								if (
									removeNode(node?.id, store.$state.mindMap)
								) {
									render(graph, store.$state.mindMap);
								}
							},
						},
					},
				]);
			}
			const item = findItem(store.$state.mindMap, node.id);
			if (item?.node?.children?.length) {
				node.addTools([
					{
						name: 'button',
						args: {
							markup: [
								{
									tagName: 'circle',
									selector: 'button',
									attrs: {
										r: 7,
										stroke: '#A2B1C3',
										'stroke-width': 1,
										fill: '#A2B1C3',
										cursor: 'pointer',
									},
								},
								{
									tagName: 'text',
									textContent: '-',
									selector: 'icon',
									attrs: {
										fill: 'white',
										'font-size': 12,
										'text-anchor': 'middle',
										'pointer-events': 'none',
										y: '0.3em',
									},
								},
							],
							x: '100%',
							y: '100%',
							offset: { x: 6, y: -14 },
							onClick(view: View) {
								toggleNodeCollapsed(node, graph, store.getCollapsedById(node.id));
								store.toggleCollapsedByID(node.id, !store.getCollapsedById(node.id));
							},
						},
					},
				]);

			}
		});

		graph.on('node:mouseleave', ({ node }) => {
			if (node.hasTool('button-remove')) {
				node.removeTool('button-remove');
			}
		});

		render(graph, data);
	});

	watchEffect(() => {
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
