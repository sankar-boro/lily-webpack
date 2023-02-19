import { UPDATE_IMAGE, UPDATE_BOOK, URL_UPDATE_IMAGE_BOOK, UPDATE_BOOK_NODE, URL_UPDATE_IMAGE_NODE_BOOK, UPLOAD_IMAGE } from "lily-query";
import { postRequest, updateImage, uploadImage, createVue } from "../index";

const pageDispatcher = (props: any, preFormData: any) => {
    const { ctxProvider, node, nodeIndex106 } = props;
    const { dispatch, context, bookContext, titles, contextId } = ctxProvider;
    const { node104UniqueId, nodeIndex104, nodeIndex105 } = bookContext;
    const { mainNode } = bookContext;
    const node104: any = context[node104UniqueId];
    const nodeIdentity = node.identity;
    const { title, body, metadata } = preFormData;
    
    let newMainNode = null;
    let newChildNodes = null;
    let newCategoryNode = null;

    if (nodeIdentity === 101) {
        newMainNode = { ...mainNode, title, body, metadata };
        newChildNodes = [];
        newCategoryNode = newMainNode
        context[contextId] = newMainNode;
        titles[0].title = title;
    }
    if (nodeIdentity === 104) {
        node104.title = title;
        node104.body = body;
        node104.metadata = metadata;
        const { child, ...x } = node104;
        newMainNode = x;
        newChildNodes = child;
        newCategoryNode = x;
        context[node104UniqueId] = node104;
        titles[nodeIndex104].title = title;
    }
    if (nodeIdentity === 105) {
        let j: any = context[node104UniqueId].child[nodeIndex105];
        j = { ...j, title, body, metadata }
        context[node104UniqueId].child[nodeIndex105] = j;
        newMainNode = j;
        newChildNodes = j.child;
        newCategoryNode = j;
        titles[nodeIndex104].child[nodeIndex105].title = title;
    }
    if (nodeIdentity === 106) {
        let j: any = context[node104UniqueId].child[nodeIndex105].child[nodeIndex106];
        j = { ...j, title, body, metadata }
        context[node104UniqueId].child[nodeIndex105].child[nodeIndex106] = j;
        const t = context[node104UniqueId].child[nodeIndex105];
        newMainNode = t;
        newChildNodes = t.child;
        newCategoryNode = t;
    }
    const vue = createVue({ docType: 'book', status: 'view' });
    
    dispatch({
        keys: ['context', 'bookContext', 'vueCtx', 'titles', 'modalCtx'],
        values: [context, { ...bookContext, mainNode: newMainNode, childNodes: newChildNodes, category: newCategoryNode }, vue, titles, null],
    })
}

export const updateBookHandler = (props: any) => {
    const { ctxProvider, node } = props;
    const { vueCtx, dispatch, bookContext, contextId} = ctxProvider
    const { node104UniqueId } = bookContext;
    const nodeIdentity = node.identity;
    
    const formData = { 
        titleLabel: 'Update Name/Title',
        bodyLabel: 'Update Body/Description',
        titleValue: node.title,
        bodyValue: node.body,
        method: 'update', 
        identity: node.identity,
        metadata: node.metadata,
        url: node.url ? JSON.parse(node.url) : null,
        authorId: node.authorId, 
    }

    const createBookUpdateData = (f: any) => {
        const { title, body, metadata, category } = f;
        const r: any = {
            title,
            body,
            bookId: contextId,
            uniqueId: node.uniqueId,
            pageId: node.pageId,
            metadata
        }
        if (nodeIdentity === 101) {
            r.category = category;
            r.createdAt = node.createdAt;
        }
        return r;
    }

    const onCallBack = (preFormData: any) => {
        const bookSubmitData = createBookUpdateData(preFormData);
        const url = nodeIdentity === 101 ? UPDATE_BOOK : UPDATE_BOOK_NODE;
        postRequest(url, bookSubmitData)
        .then((r: any) => {
            console.log(r)
            pageDispatcher(props, preFormData);
        })
        .catch((e: any) => {
            console.log('e', e)
        })
    }

    const onCancel = () => {
        const vue = {
            docType: vueCtx.docType,
            status: 'view'
        }
        dispatch({
            keys: ['vueCtx'],
            values: [vue]
        })
    }

    const createImageUpdateData = (i: any, j: any) => {
        const { category, metadata } = i;
        const r: any = {
            image_url: JSON.stringify(j),
            uniqueId: node.uniqueId,
            bookId: contextId,
            pageId: node104UniqueId,
        }
        if (nodeIdentity === 101) {
            r.createdAt = node.createdAt;
            r.category = category;
            r.metadata = metadata;
        }
        return r;
    }

    const onUpdateImage = (preUpdateImageFormData: any) => {
        const postUpdateImageUrl = nodeIdentity === 101 ? URL_UPDATE_IMAGE_BOOK: URL_UPDATE_IMAGE_NODE_BOOK;
        if (!preUpdateImageFormData.url) {
            uploadImage(UPLOAD_IMAGE, preUpdateImageFormData)
            .then((updateImgRes: any) => {
                const imageUpdateData = createImageUpdateData(preUpdateImageFormData, updateImgRes.data);
                return postRequest(postUpdateImageUrl, imageUpdateData)
            })
            .catch((e) => {
                console.log(e)
            })
        } else {

            updateImage(UPDATE_IMAGE, preUpdateImageFormData, formData.url)
            .then((updateImgRes: any) => {
                const imageUpdateData = createImageUpdateData(preUpdateImageFormData, updateImgRes.data);
                return postRequest(postUpdateImageUrl, imageUpdateData)
            })
            .catch((e) => {
                console.log(e)
            })
        }
    }

    const vue = {
        data: formData,
        callback: onCallBack,
        cancel: onCancel,
        updateImage: onUpdateImage,
        docType: vueCtx.docType,
        status: 'form'
    }
    dispatch({
        keys: ['vueCtx'],
        values: [vue]
    })
}