import { createVue, getNodeIds, LOG, postRequest } from "lily-utils";
import { DELETE_AND_UPDATE_BLOG_NODE, DELETE_BLOG_NODE, DELETE_BLOG } from "lily-query";

export const deleteBlog = (props: any) => {
    const { ctxProvider, node, navigate } = props;
	const { dispatch, contextId, contextData } = ctxProvider
	const { category } = contextData;
	const deleteData = {
		blogId: contextId,
		category
	}
	const onSubmit = () => {
		if (!LOG) {
            postRequest(DELETE_BLOG, deleteData)
            .then((res) => {
				console.log(res)
				navigate(`/`);
            })
            .catch((e) => {
                console.log(e)
            })
        } else {
            
        }
	}

	dispatch({
		keys: ['modalCtx'],
		values: [{
			data: { method: 'delete' }, 
			title: 'Delete', 
			node,
			childNodes: [],
			updateIds: null,
			actions: {
				deleteHandle: () => {
					onSubmit();
				}
			}
		}]
	})
}
export const deleteBlogNode = (props: any) => {
    const { ctxProvider, node, nodeIndex } = props;
	const { dispatch } = ctxProvider;
	const { contextId, blogContext } = JSON.parse(JSON.stringify(ctxProvider));
	const { childNodes, mainNode } = blogContext;
	const deleteBlogNodes: any = [];

	const blogId = contextId;
	let updateIds: any = null;
	let newChildNodes: any = null;

	if (node && node.identity === 104) {
		updateIds = getNodeIds({ 
            nodeIndex, 
            nodes: childNodes, 
            method: 'delete',
            mainNode, 
        });

		// Delete data
		deleteBlogNodes.push(node.uniqueId);

		// Dispatch data
		newChildNodes = [];
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
	}

	let url = DELETE_BLOG_NODE;
	const deleteData: any = {
		blogId,
		blogNodes: deleteBlogNodes,
	}

	if (updateIds?.botUniqueId) {
		deleteData.updateData = updateIds;
		url = DELETE_AND_UPDATE_BLOG_NODE;
	}

	const vue = createVue({ docType: 'blog', status: 'view'});
	dispatch({
		keys: ['modalCtx'],
		values: [{
			data: { method: 'delete' }, 
			title: 'Delete', 
			node,
			childNodes: [],
			updateIds,
			actions: {
				deleteHandle: () => {
					onSubmit();
				}
			}
		}]
	})

	const onSubmit = () => {
        if (!LOG) {
            postRequest(url, deleteData)
            .then((res) => {
				console.log(res)
                dispatch({
                    keys: ['blogContext', 'vueCtx', 'modalCtx'],
                    values: [{...blogContext, childNodes: newChildNodes }, vue, null],
                })
            })
            .catch((e) => {
                console.log(e)
            })
        } else {
            console.log('url', url);
            console.log('deleteDAta', deleteData);
            console.log('dispatch', [{...blogContext, childNodes: newChildNodes }, vue]);
        }
	}
}
