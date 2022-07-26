import { MindMapData } from '@/types';
import { defineStore } from 'pinia';

const data: MindMapData = {
	id: '1',
	type: 'topic',
	label: '中心主题',
	width: 160,
	height: 50,
	children: [
		{
			id: '1-1',
			type: 'topic-branch',
			label: '分支主题1',
			width: 100,
			height: 40,
			children: [
				{
					id: '1-1-1',
					type: 'topic',
					label: '子主题1',
					width: 100,
					height: 40,
				},
				{
					id: '1-1-2',
					type: 'topic',
					label: '子主题2',
					width: 100,
					height: 40,
				},
			],
		},
		{
			id: '1-2',
			type: 'topic-branch',
			label: '分支主题2',
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
