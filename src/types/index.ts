interface MindMapData {
	id: string;
	isEditing?: boolean;
	isHiddenSuccessor?: boolean;
	type: 'topic';
	label: string;
	width: number;
	height: number;
	children?: MindMapData[];
}

interface HierarchyResult {
	id: string;
	x: number;
	y: number;
	data: MindMapData;
	children?: HierarchyResult[];
}

type NodeType =  MindMapData['type']

export { MindMapData, HierarchyResult, NodeType };
