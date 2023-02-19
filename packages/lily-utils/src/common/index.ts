

export const getChildIds = (node: any) => {
	const deleteIds: any = [];
	node.child.forEach((__node: any) => {
		deleteIds.push(__node.uniqueId);
		if (__node.child && node.child.length > 0) {
			__node.child.forEach((node__: any) => {
				deleteIds.push(node__.uniqueId);
			})
		} 
	})
	return deleteIds;
}

export const createVue = (props: any) => {
    const { docType, status } = props;
    return {
        document: {},
        form: {
            formTitle: '',
            data: null,
            callback: (res: any) => {
                console.log(res)
            },
            cancel: () => {
                console.log('cancel')
            }
        },
        docType: docType ? docType : null,
        status
    }
}

export const getPageIds = (props: any) => {
    const { method, titleNodes, nodeIndex } = props;
    // Init topUniqueId
    let topUniqueId = null;
    let topNode = null;
        
    // Create topUniqueId
    
    topNode = titleNodes[nodeIndex];
    topUniqueId = topNode.uniqueId;

    // Delete topUniqueId
    if (method === 'delete') {
        if (nodeIndex !== 0 && titleNodes[nodeIndex - 1]) {
            topNode = titleNodes[nodeIndex - 1]
            topUniqueId = topNode.uniqueId
        }
    }

    // Init botUniqueId
    let botUniqueId = null;
    let botNode = null;

    if (titleNodes[nodeIndex + 1]) {
        botNode = titleNodes[nodeIndex + 1]
        botUniqueId = botNode.uniqueId
    }
    return { topUniqueId, botUniqueId, topNode, botNode };
}

export const getNodeIds = (props: any) => {
    const { method, nodes, nodeIndex, mainNode } = props;
    // Init topUniqueId
    let topUniqueId = null;
    let topNode = null;
    // Init botUniqueId
    let botUniqueId = null;
    let botNode = null;

    if (method === 'create') {
        if (nodeIndex === null && nodes.length === 0) {
            topNode = mainNode;
            topUniqueId = topNode.uniqueId;
            return { topUniqueId, topNode, botNode, botUniqueId }
        }
        if (nodeIndex === null && nodes.length > 0) {
            topNode = mainNode;
            topUniqueId = topNode.uniqueId;
            botNode = nodes[0];
            botUniqueId = botNode.uniqueId;
            return { topUniqueId, topNode, botNode, botUniqueId }
        }
        // Create topUniqueId
        topNode = nodes[nodeIndex];
        topUniqueId = topNode.uniqueId;
    }

    // Delete topUniqueId
    if (method === 'delete') {
        topNode = mainNode;
        topUniqueId = topNode.uniqueId
        if (nodeIndex !== null && nodeIndex > 0 && nodes[nodeIndex - 1]) {
            topNode = nodes[nodeIndex - 1]
            topUniqueId = topNode.uniqueId
        }
    }

    if (nodes[nodeIndex + 1]) {
        botNode = nodes[nodeIndex + 1]
        botUniqueId = botNode.uniqueId
    }
    return { topUniqueId, botUniqueId, topNode, botNode };
}

export const getSectionIds = (props: any) => {
    const { node104, node105, nodeIndex105, method } = props;
    // Init topUniqueId
    let topUniqueId = null;
    let topNode = null;
        
    // Create topUniqueId
    if (method === 'create') {
        if (node105 === null) {
            topNode = node104;
            topUniqueId = topNode.uniqueId
        } else {
            topNode = node104.child[nodeIndex105];
            topUniqueId = topNode.uniqueId;
        }
    }

    // Delete topUniqueId
    if (method === 'delete') {
        topNode = node104;
        topUniqueId = topNode.uniqueId
        if (typeof nodeIndex105 === 'number' && nodeIndex105 >= 0 && node104.child[nodeIndex105 - 1]) {
            topNode = node104.child[nodeIndex105 - 1]
            topUniqueId = topNode.uniqueId
        }
    }

    // Init botUniqueId
    let botUniqueId = null;
    let botNode = null;

    if (node105 === null && node104.child.length > 0) {
        botNode = node104.child[0]
        botUniqueId = botNode.uniqueId
    } else if (typeof nodeIndex105 === 'number' && nodeIndex105 >= 0 && node104.child[nodeIndex105 + 1]) {
        botNode = node104.child[nodeIndex105 + 1];
        botUniqueId = botNode.uniqueId
    }
    return { topUniqueId, botUniqueId, topNode, botNode };
}

export const getSubSectionIds = (props: any) => {
    const { node105, method, node106, nodeIndex106 } = props;
    // Init topUniqueId
    let topUniqueId = null;
    let topNode = null;
        
    // Create topUniqueId
    if (method === 'create') {
        if (node106 === null) {
            topNode = node105;
            topUniqueId = topNode.uniqueId
        } else {
            topNode = node105.child[nodeIndex106];
            topUniqueId = topNode.uniqueId;
        }
    }

    // Delete topUniqueId
    if (method === 'delete') {
        topNode = node105;
        topUniqueId = topNode.uniqueId
        
        if (nodeIndex106 !== 0 && node105.child[nodeIndex106 - 1]) {
            topNode = node105.child[nodeIndex106 - 1];
            topUniqueId = topNode.uniqueId
        }
    }

    // Init botUniqueId
    let botUniqueId = null;
    let botNode = null;

    if (node106 === null && node105.child.length > 0) {
        botNode = node105.child[0]
        botUniqueId = botNode.uniqueId
    } else if (typeof nodeIndex106 === 'number' && nodeIndex106 >= 0 && node105.child[nodeIndex106 + 1]) {
        botNode = node105.child[nodeIndex106 + 1];
        botUniqueId = botNode.uniqueId
    }
    return { topUniqueId, botUniqueId, topNode, botNode };
}