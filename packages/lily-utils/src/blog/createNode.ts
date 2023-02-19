import { APPEND_BLOG_NODE, MERGE_BLOG_NODE, UPLOAD_IMAGE } from 'lily-query';
import { createVue, postRequest, uploadImage, LOG } from "../index";
import { getNodeIds } from "../common";

const pageDispatcher = (props: any, blogSumitData: any, afterBlogSubmitData: any) => {
    const { ctxProvider } = props;
    const { dispatch, blogContext } = ctxProvider;
    const { childNodes } = blogContext;
    const newNode = blogSumitData;
    newNode.uniqueId = afterBlogSubmitData.uniqueId;
    newNode.pageId = afterBlogSubmitData.pageId;
    newNode.parentId = blogSumitData.topUniqueId;
    newNode.identity = 104;

    let done = false;
    const newChildNodes: any = [];
    childNodes.forEach((node: any) => {
        if (node.uniqueId === newNode.topUniqueId) {
            newChildNodes.push(node);
            newChildNodes.push(newNode)
            done = true;
        } else if (done){
            newChildNodes.push({ ...node, parentId: newNode.uniqueId });
            done = false;
        } else {
            newChildNodes.push(node);
        }
    })

    // const { topUniqueId: xx, botUniqueId: yy, ...ot } = newNode;

    const blogView = createVue({ status: 'view', docType: 'blog' });
    const values = [{ ...blogContext, childNodes: newChildNodes }, blogView, null];
    dispatch({
        keys: ['blogContext', 'vueCtx', 'modalCtx'],
        values
    })
}

export const createBlogNode = (props: any) => {
    if (LOG) {
        console.log('props', props);
    }
    const { ctxProvider, nodeIndex } = props
    const { vueCtx, dispatch, contextId, blogContext } = ctxProvider;
    const { childNodes, mainNode } = blogContext;
    const formData = { 
        titleLabel: 'Chapter Name',
        bodyLabel: 'Chapter Description',
        titleValue: '',
        bodyValue: '',
        method: 'create', 
        identity: 104 
    }
    const updateIds = getNodeIds({
        method: 'create',
        nodes: childNodes,
        nodeIndex,
        mainNode, 
    });
    const { topUniqueId, botUniqueId } = updateIds;
    const url = botUniqueId ? MERGE_BLOG_NODE : APPEND_BLOG_NODE;
    const createPageSubmitData = (f: any, i: any) => {
        const { title, body, metadata } = f;
        return {
            title,
            body,
            metadata,
            image_url: i ? JSON.stringify(i) : null,
            topUniqueId,
            botUniqueId,
            blogId: contextId,
        }
    }
    let blogSubmitData: any = null;
    const onCallBack = (preFormData: any) => {
        showModal(preFormData);
    }
    const showModal = (preFormData: any) => {
        dispatch({
            keys: ['modalCtx'],
            values: [{
                data: { method: 'create' },
                title: 'Create',
                node: { ...preFormData, identity: 104 },
                updateIds,
                childNodes: [],
                actions: {
                    createHandle: () => { onSubmit(preFormData)}
                }
            }]
        })
    }
    const onSubmit = (preFormData: any) => {
        if (!LOG) {
            uploadImage(UPLOAD_IMAGE, preFormData)
            .then((postImgRes: any) => {
                blogSubmitData = createPageSubmitData(preFormData, postImgRes.data);
                return postRequest(url, blogSubmitData)
            })
            .then((postCreateData: any) => {
                pageDispatcher(props, blogSubmitData, postCreateData.data);
            })
            .catch((e: any) => {
                console.log(e);
            }) 
        } else {
            console.log('preFormData', preFormData)
            blogSubmitData = createPageSubmitData(preFormData, null);
            console.log('blogSubmitData', blogSubmitData)
            console.log('url', url)
        }
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

    const vue = {
        data: formData,
        callback: onCallBack,
        cancel: onCancel,
        docType: vueCtx.docType,
        status: 'form'
    }
    dispatch({
        keys: ['vueCtx'],
        values: [vue]
    })
}