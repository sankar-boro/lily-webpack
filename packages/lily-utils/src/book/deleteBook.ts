import { createVue, getPageIds, getSectionIds, getSubSectionIds, postRequest } from "lily-utils";
import { DELETE_AND_UPDATE_BOOK_NODE, DELETE_BOOK, DELETE_BOOK_NODE } from "lily-query";

export const deleteBook = (props: any) => {
	const { ctxProvider, node, navigate } = props;
	const { titles, contextId, dispatch } = ctxProvider;
	const allPageIds: any = [];
	if (node.identity === 101) {
		titles.forEach((title: any) => {
			allPageIds.push(title.uniqueId);
		})
	}

	const meta = JSON.parse(node.metadata);
	const data = {
		bookId: contextId,
		category: meta.category,
		deleteData: allPageIds
	}

	const onSubmit = () => {
		postRequest(DELETE_BOOK, data)
		.then((res) => {
			console.log(res)
			navigate(`/`);
		})
		.catch((e) => {
			console.log(e)
		})
	}
	dispatch({
		keys: ['modalCtx'],
		values: [{
			data: { method: 'delete' }, 
			title: 'Delete', 
			node,
			childNodes: [],
			updateIds: [],
			actions: {
				deleteHandle: () => {
					onSubmit();
				}
			}
		}]
	})


}

export const deleteNode = (props: any) => {
	const { ctxProvider, node, nodeIndex106, } = props;
	const { dispatch } = ctxProvider;
	const { context, contextId, contextData, bookContext, titles } = JSON.parse(JSON.stringify(ctxProvider));
	const { mainNode, childNodes, nodeIndex104, nodeIndex105, node104UniqueId } = bookContext;
	const node104 = context[node104UniqueId];
	const { category } = contextData;
	const deleteBookNodes: any = [];
	const deleteTitleNodes: any = [];

	const bookId = contextId;
	let updateIds: any = null;
	let pageId: any = null;
	let newChildNodes: any = null;
	let newMainNode: any = null;
	let newCategory: any = null;
	let newTitles: any = [];
	let newNode104UniqueId: any = null;
	let newNodeIndex104: any = null;
	let newNodeIndex105: any = null;

	if (node && node.identity === 104) {
		// node = 104, childNodes = 105
		pageId = node104UniqueId
		updateIds = getPageIds({ nodeIndex: nodeIndex104, titleNodes: titles, method: 'delete' });

		// Delete data
		deleteBookNodes.push(node.uniqueId);
		deleteTitleNodes.push(node.uniqueId);
		childNodes.forEach((sec: any) => {
			deleteBookNodes.push(sec.uniqueId);
			deleteTitleNodes.push(sec.uniqueId);
			sec.child && sec.child.forEach((sub: any) => {
				deleteBookNodes.push(sub.uniqueId);
				deleteTitleNodes.push(sub.uniqueId);
			})
		})

		// Dispatch data
		delete context[node104UniqueId];
		newChildNodes = [];
		newMainNode = context[contextId]
		newCategory = newMainNode;
		titles.forEach((pageT: any) => {
			if (pageT.uniqueId !== node.uniqueId) {
				newTitles.push(pageT);
			}
		})
		newNodeIndex104 = 0;
		newNode104UniqueId = contextId;
	}

	if (node && node.identity === 105) {
		// node = 105, childNodes = 106
		pageId = node104UniqueId
		updateIds = getSectionIds({ node104, node105: node, nodeIndex105: nodeIndex105, method: 'delete' });

		// Delete data
		deleteBookNodes.push(node.uniqueId);
		deleteTitleNodes.push(node.uniqueId);
		childNodes.forEach((sub: any) => {
			deleteBookNodes.push(sub.uniqueId);
			deleteTitleNodes.push(sub.uniqueId);
		})

		// dispatch
		let done = false;
		const newChild: any = [];
		node104.child.forEach((sec: any) => {
			if (sec.uniqueId === node.uniqueId){
				done = true;
			} else if (done) {
				done = false;
				newChild.push({ ...sec, parentId: updateIds.topUniqueId });
			} else {
				newChild.push(sec);
			}
		})
		node104.child = newChild;
		context[node104UniqueId] = node104;
		newChildNodes = [];
		newMainNode = context[contextId]
		newCategory = newMainNode;
		titles.forEach((pageT: any) => {
			if (pageT.uniqueId === node104.uniqueId) {
				const newSecTs: any = [];
				let done = false;
				pageT.child.forEach((secT: any) => {
					if (secT.uniqueId === node.uniqueId) {
						done=true;
					} else if (done) {
						done = false;
						newSecTs.push({...secT, parentId: updateIds.topUniqueId });
					} else {
						newSecTs.push(secT);
					}
				})
				newTitles.push({...pageT, child: newSecTs});
			} else {
				newTitles.push(pageT);
			}
		})
		newNodeIndex104 = nodeIndex104;
		newNode104UniqueId = node104UniqueId;
	}

	if (node && node.identity === 106) {
		pageId = node104UniqueId
		updateIds = getSubSectionIds({ node104, node105: { ...mainNode, child: childNodes }, nodeIndex105: nodeIndex105, method: 'delete', nodeIndex106 });
		deleteBookNodes.push(node.uniqueId);
		deleteTitleNodes.push(node.uniqueId);
		let done = false;
		newChildNodes = childNodes.filter((n: any) => {
			if (n.uniqueId === node.uniqueId) {
				done = true;
				return false;
			} else if (done) {
				const t = n;
				t.parentId = updateIds.topUniqueId;
				done = false;
			}
			return true;
		})
		newMainNode = mainNode;
		newCategory = bookContext.category;
		newTitles = titles;

		newNodeIndex104 = nodeIndex104;
		newNodeIndex105 = nodeIndex105;
		newNode104UniqueId = node104UniqueId;
	}

	let url = DELETE_BOOK_NODE;
	const deleteData: any = {
		bookId,
		pageId,
		category,
		bookNodes: deleteBookNodes,
		titleNodes: deleteTitleNodes,
	}
	if (updateIds?.botUniqueId) {
		deleteData.updateData = updateIds;
		url = DELETE_AND_UPDATE_BOOK_NODE;
	}

	const vue = createVue({ docType: 'book', status: 'view'});
	dispatch({
		keys: ['modalCtx'],
		values: [{
			data: { method: 'delete' }, 
			title: 'Delete', 
			node,
			childNodes,
			updateIds,
			actions: {
				deleteHandle: () => {
					onSubmit();
				}
			}
		}]
	})

	const onSubmit = () => {
		postRequest(url, deleteData)
		.then((res) => {
			console.log(res)
			dispatch({
				keys: ['bookContext', 'vueCtx', 'context', 'titles', 'modalCtx'],
				values: [{
					mainNode: newMainNode, 
					childNodes: newChildNodes, 
					category: newCategory,
					nodeIndex104: newNodeIndex104,
					nodeIndex105: newNodeIndex105,
					node104UniqueId: newNode104UniqueId, 
				}, vue, context, newTitles, null],
			})
		})
		.catch((e) => {
			console.log(e)
		})
	}
}