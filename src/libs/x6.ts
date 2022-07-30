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

const addChildNode = (id: string, type: NodeType, data: MindMapData) => {
	const res = findItem(data, id);
	const dataItem = res?.node;
	if (dataItem) {
		const length = dataItem.children ? dataItem.children.length : 0;
        const item = {
            id: `${id}-${length + 1}`,
            type: 'topic',
            label: `child ${length + 1}`,
            width: 100,
            height: 40,
        } as MindMapData;
        if (dataItem.children) {
            dataItem.children.push(item);
        } else {
            dataItem.children = [item];
        }
        return item;
	}
	return null;
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
                cell.toBack()
			});
		}
	};
	run(node);
};

const render = (graph: any, data: MindMapData) => {
	const result: HierarchyResult = Hierarchy.mindmap(data, {
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

export { addChildNode, removeNode, render, toggleNodeCollapsed, findItem };
