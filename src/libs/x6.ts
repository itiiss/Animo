import { Graph, Cell, Node, Path, Shape } from '@antv/x6';
import Hierarchy from '@antv/hierarchy';
import { HierarchyResult, MindMapData, NodeType } from '@/types';
import RootNode from '../components/RootNode.vue';
import '@antv/x6-vue-shape';

Graph.registerNode('topic', {
	inherit: 'vue-shape',
	x: 200,
	y: 150,
	width: 150,
	height: 100,
	component: {
		template: `<RootNode />`,
		components: {
			RootNode,
		},
	},
});

// 连接器
Graph.registerConnector(
	'mindmap',
	(sourcePoint, targetPoint, routerPoints, options) => {
		const midX = sourcePoint.x + 10;
		const midY = sourcePoint.y;
		const ctrX = (targetPoint.x - midX) / 5 + midX;
		const ctrY = targetPoint.y;
		const pathData = `
       M ${sourcePoint.x} ${sourcePoint.y}
       L ${midX} ${midY}
       Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
      `;
		return options.raw ? Path.parse(pathData) : pathData;
	},
	true
);

// 边
Graph.registerEdge(
	'mindmap-edge',
	{
		inherit: 'edge',
		connector: {
			name: 'mindmap',
		},
		attrs: {
			line: {
				targetMarker: '',
				stroke: '#A2B1C3',
				strokeWidth: 2,
			},
		},
		visible: true,
		zIndex: 0,
	},
	true
);

const findItem = (
	obj: MindMapData,
	id: string
): {
	parent: MindMapData | null;
	node: MindMapData | null;
} | null => {
	if (obj.id === id) {
		return {
			parent: null,
			node: obj,
		};
	}
	const { children } = obj;
	if (children) {
		for (let i = 0, len = children.length; i < len; i++) {
			const res = findItem(children[i], id);
			if (res) {
				return {
					parent: res.parent || obj,
					node: res.node,
				};
			}
		}
	}
	return null;
};

const traverseAndModify = (
	obj: MindMapData,
	id: string,
	cb: (obj: MindMapData) => void
) => {
	if (obj.id === id) {
		cb(obj);
	} else {
		obj.children?.forEach((subObj: MindMapData) => {
			traverseAndModify(subObj, id, cb);
		});
	}
};

const getParentID = (data: MindMapData, id: string) => {
	const res = findItem(data, id);
	return res?.parent?.id ?? '';
};

const getChildID = (data: MindMapData, id: string) => {
	const res = findItem(data, id);
	return res?.node?.children?.at(0)?.id ?? '';
};

const getNextSiblingID = (data: MindMapData, id: string) => {
	const res = findItem(data, id);
	const siblings = res?.parent?.children ?? [];
	const curIndex = findIndex(id, siblings);
	return res?.parent?.children?.at(curIndex + 1)?.id ?? '';
};

const getPrevSiblingID = (data: MindMapData, id: string) => {
	const res = findItem(data, id);
	const siblings = res?.parent?.children ?? [];
	const curIndex = findIndex(id, siblings);
	return res?.parent?.children?.at(curIndex - 1)?.id ?? '';
};

const findIndex = (id: string, children: MindMapData[]) => {
	return children?.map(child => child.id).findIndex(item => item === id);
};

const addNode = (obj: MindMapData, id: string) => {
	if (obj) {
		const length = obj.children ? obj.children.length : 0;
		const item = {
			id: `${id}-${length + 1}`,
			type: 'topic',
			label: `child ${length + 1}`,
			width: 160,
			height: 40,
		} as MindMapData;
		if (obj.children) {
			obj.children.push(item);
		} else {
			obj.children = [item];
		}
		return item;
	}
	return null;
};

const addChildNode = (id: string, data: MindMapData) => {
	const res = findItem(data, id);
	const dataItem = res?.node as MindMapData;
	return addNode(dataItem, id);
};

const addSiblingNode = (id: string, data: MindMapData) => {
	const res = findItem(data, id);
	const parentId = res?.parent?.id as string;
	const parentItem = findItem(data, parentId)?.node as MindMapData;
	return addNode(parentItem, parentId);
};

const removeNode = (id: string, data: MindMapData) => {
	const res = findItem(data, id);
	const dataItem = res?.parent;
	if (dataItem && dataItem.children) {
		const { children } = dataItem;
		const index = children.findIndex(item => item.id === id);
		return children.splice(index, 1);
	}
	return null;
};

const toggleNodeCollapsed = (node: Node, graph: Graph, hidden: boolean) => {
	const run = (pre: Node) => {
		const succ = graph.getSuccessors(pre);
		if (succ) {
			succ.forEach(cell => {
				cell.setVisible(hidden);
				cell.toBack();
			});
		}
	};
	run(node);
};

const render = (graph: any, obj: MindMapData) => {
	const result: HierarchyResult = Hierarchy.mindmap(obj, {
		direction: 'H',
		getHeight(d: MindMapData) {
			return d.height;
		},
		getWidth(d: MindMapData) {
			return d.width;
		},
		getHGap() {
			return 40;
		},
		getVGap() {
			return 20;
		},
		getSide: () => {
			return 'right';
		},
	});
	const cells: Cell[] = [];
	const traverse = (hierarchyItem: HierarchyResult) => {
		if (hierarchyItem) {
			const { data, children } = hierarchyItem;
			const newNode = graph.createNode({
				id: data.id,
				shape: 'topic',
				x: hierarchyItem.x,
				y: hierarchyItem.y,
				width: data.width,
				height: data.height,
				data: {
					label: data.label,
				},
				label: data.label,
				type: data.type,
				tools: [
					{
						name: 'button',
						args: {
							markup: [
								{
									tagName: 'circle',
									selector: 'button',
									attrs: {
										r: 7,
										fill: 'white',
										cursor: 'pointer',
									},
								},
								{
									tagName: 'text',
									textContent: '+',
									selector: 'icon',
									attrs: {
										fill: '#black',
										'font-size': 12,
										'text-anchor': 'middle',
										'pointer-events': 'none',
										y: '0.3em',
									},
								},
							],
							x: '100%',
							y: '100%',
							offset: { x: -10, y: -28 },
							onClick() {
								if (addChildNode(data.id, obj)) {
									render(graph, obj);
								}
							},
						},
					},
					children?.length &&
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
							onClick() {
							}
						},
					},
				],
			});
			cells.push(newNode);
			if (children) {
				children.forEach((item: HierarchyResult) => {
					const { id, data } = item;
					cells.push(
						graph.createEdge({
							shape: 'mindmap-edge',
							source: {
								cell: hierarchyItem.id,
								anchor:
									data.type === 'topic'
										? {
												name: 'right',
												args: {
													dx: -16,
												},
										  }
										: {
												name: 'center',
												args: {
													dx: '25%',
												},
										  },
							},
							target: {
								cell: id,
								anchor: {
									name: 'left',
								},
							},
							data: {
								label: data.label,
							},
						})
					);
					traverse(item);
				});
			}
		}
	};
	traverse(result);
	graph.resetCells(cells);
	graph.centerContent();
};

export {
	addChildNode,
	addSiblingNode,
	removeNode,
	render,
	toggleNodeCollapsed,
	findItem,
	traverseAndModify,
	getParentID,
	getChildID,
	getNextSiblingID,
	getPrevSiblingID,
};
