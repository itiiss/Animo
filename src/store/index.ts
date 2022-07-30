import { MindMapData } from '@/types';
import { defineStore } from 'pinia';

export const ROOT_NODE_ID = 'ROOT_NODE_ID';

const data: MindMapData = {
	id: ROOT_NODE_ID,
	type: 'topic',
	label: 'root topic',
	width: 160,
	height: 50,
	children: [
		{
			id: '1-1',
			type: 'topic',
			label: 'child 1',
			width: 100,
			height: 40,
			children: [
				{
					id: '1-1-1',
					type: 'topic',
					label: 'subchild 1',
					width: 100,
					height: 40,
				},
				{
					id: '1-1-2',
					type: 'topic',
					label: 'subchild 2',
					width: 100,
					height: 40,
				},
			],
		},
		{
			id: '1-2',
			type: 'topic',
			label: 'child 2',
			width: 100,
			height: 40,
		},
	],
};

export const useStore = defineStore('store', {
	state: () => ({
		mindMap: data
	}),
});
