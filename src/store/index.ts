import { MindMapData } from '@/types';
import { getTextWidth } from '@/utils/text';
import { defineStore } from 'pinia';
import { findItem, traverseAndModify } from '../libs/x6';

export const ROOT_NODE_ID = 'ROOT_NODE_ID';

const data: MindMapData = {
	id: ROOT_NODE_ID,
	type: 'topic',
	label: 'root topic',
	width: 160,
	height: 50,
	isEditing: false,
	isHiddenSuccessor: false,
	children: [
		{
			id: '1-1',
			type: 'topic',
			label: 'child 1',
			width: 100,
			height: 40,
			isEditing: false,
			isHiddenSuccessor: false,
			children: [
				{
					id: '1-1-1',
					type: 'topic',
					label: 'subchild 1',
					width: 100,
					height: 40,
					isEditing: false,
					isHiddenSuccessor: false,
				},
				{
					id: '1-1-2',
					type: 'topic',
					label: 'subchild 2',
					width: 100,
					height: 40,
					isEditing: false,
					isHiddenSuccessor: false,
				},
			],
		},
		{
			id: '1-2',
			type: 'topic',
			label: 'child 2',
			width: 100,
			height: 40,
			isEditing: false,
			isHiddenSuccessor: false,
		},
	],
};

export const useStore = defineStore('store', {
	state: () => ({
		mindMap: data
	}),
	getters: {
		getEditByID: (state) => {
			return (id: string) => {
				return findItem(state.mindMap, id)?.node?.isEditing
			}
		},
		getTextByID: (state) => {
			return (id: string) => {
				return findItem(state.mindMap, id)?.node?.label ?? ''
			}
		},
		getTextWidthById: (state) => {
			return (id: string) => {
				return getTextWidth(findItem(state.mindMap, id)?.node?.label ?? '')
			}
		},
		getCollapsedById: (state) => {
			return (id: string) => {
				return findItem(state.mindMap, id)?.node?.isHiddenSuccessor ?? false
			}
		},
	},
	actions: {
		modifyTextByID(id: string, text: string) {
			traverseAndModify(this.mindMap, id, (item: MindMapData) => item.label = text);
		},
		toggleEditByID (id: string, edit: boolean) {
			traverseAndModify(this.mindMap, id, (item: MindMapData) => item.isEditing = edit);
		},
		toggleCollapsedByID (id: string, collapse: boolean) {
			traverseAndModify(this.mindMap, id, (item: MindMapData) => item.isHiddenSuccessor = collapse);
		}
	}
});
