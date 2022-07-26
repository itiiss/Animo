import { Graph, Cell, Node, Path, Shape } from '@antv/x6';
import Hierarchy from '@antv/hierarchy';
import { ref, onMounted, onUnmounted, Ref } from 'vue';
import { HierarchyResult, MindMapData, NodeType } from '@/types';
import RootNode from '../components/RootNode.vue';
import '@antv/x6-vue-shape';
import console from 'console';

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
        let item: MindMapData | null = null;
        const length = dataItem.children ? dataItem.children.length : 0;
        if (type === 'topic') {
            item = {
                id: `${id}-${length + 1}`,
                type: 'topic-branch',
                label: `分支主题${length + 1}`,
                width: 100,
                height: 40,
            };
        } else if (type === 'topic-branch') {
            item = {
                id: `${id}-${length + 1}`,
                type: 'topic',
                label: `子主题${length + 1}`,
                width: 60,
                height: 30,
            };
        }
        if (item) {
            if (dataItem.children) {
                dataItem.children.push(item);
            } else {
                dataItem.children = [item];
            }
            return item;
        }
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

const toggleNodeDisplay = (
    id: string,
    isHidden: boolean,
    data: MindMapData
) => {
    const res = findItem(data, id);
    const children = res?.node?.children;
    window.console.log('toggleNodeDisplay', isHidden);
    children?.forEach(item => {
        item.hidden = isHidden;
        toggleNodeDisplay(item.id, isHidden, data);
    });
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
            cells.push(
                graph.createNode({
                    id: data.id,
                    // shape: 'vue-shape',
                    // component: data.type === 'topic' ? {
                    //     template: `<root-node :label="label"></root-node>`,
                    //     data() {
                    //       return {
                    //         label: 'x6',
                    //       }
                    //     },
                    //     components: {
                    //       RootNode,
                    //     }
                    //   } : null ,
                    shape: data.type === 'topic' ? 'topic' : 'topic',
                    x: hierarchyItem.x,
                    y: hierarchyItem.y,
                    width: data.width,
                    height: data.height,
                    data: {
                        hidden: data.hidden,
                        label: data.label,
                    },
                    label: data.label,
                    type: data.type,
                })
            );
            if (children) {
                children.forEach((item: HierarchyResult) => {
                    const { id, data } = item;
                    if (!data.hidden) {
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
                                visible: data.hidden,
                                data: {
                                    hidden: data.hidden,
                                    label: data.label,
                                },
                            })
                        );
                    }
                    traverse(item);
                });
            }
        }
    };
    traverse(result);
    graph.resetCells(cells);
    graph.centerContent();
};

export { addChildNode, removeNode, render, toggleNodeDisplay };
