import { UPDATE_BLOG, UPDATE_BLOG_NODE, UPDATE_IMAGE, URL_UPDATE_IMAGE_BLOG } from "lily-query";
import { postRequest, updateImage, createVue, LOG } from "../index";

const pageDispatcher = (props: any, preFormData: any) => {
    const { ctxProvider, node } = props;
    const { dispatch, blogContext } = ctxProvider;
    const { childNodes } = blogContext;
    const nodeIdentity = node.identity;
    const newNode = node;
    const { title, body, metadata } = preFormData;
    
    let newChildNodes = null;

    if (nodeIdentity === 104) {
        newNode.title = title;
        newNode.body = body;
        newNode.metadata = metadata;
    }

    newChildNodes = childNodes.map((nnode: any) => {
        if (nnode.uniqueId === node.uniqueId) {
            return newNode;
        }
        return nnode;
    })

    const vue = createVue({ docType: 'blog', status: 'view' });

    if (!LOG) {
        dispatch({
            keys: ['blogContext', 'vueCtx'],
            values: [{ ...blogContext, childNodes: newChildNodes }, vue],
        })
    } else {
        console.log([{ ...blogContext, childNodes: newChildNodes }, vue]);
    }
}

export const updateBlog = (props: any) => {
    const { ctxProvider, node } = props;
    const { vueCtx, dispatch, blogContext, contextId } = ctxProvider
    const { node104UniqueId } = blogContext;
    const nodeIdentity = node.identity;
    
    const formData = { 
        titleLabel: 'Update Name/Title',
        bodyLabel: 'Update Body/Description',
        titleValue: node.title,
        bodyValue: node.body,
        method: 'update', 
        identity: node.identity,
        metadata: node.metadata,
        url: JSON.parse(node.url),
        authorId: node.authorId, 
    }

    const createUpdateData = (f: any) => {
        const { title, body, metadata, category } = f;
        const r: any = {
            title,
            body,
            blogId: contextId,
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
        const blogSubmitData = createUpdateData(preFormData);
        const url = nodeIdentity === 101 ? UPDATE_BLOG : UPDATE_BLOG_NODE;
        if (!LOG) {
            postRequest(url, blogSubmitData)
            .then((r: any) => {
                console.log(r)
                pageDispatcher(props, preFormData);
            })
            .catch((e: any) => {
                console.log('e', e)
            })
        } else {
            console.log(blogSubmitData);
            pageDispatcher(props, preFormData);
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

    const createImageUpdateData = (i: any, j: any) => {
        const { category, metadata } = i;
        const r: any = {
            image_url: JSON.stringify(j),
            uniqueId: node.uniqueId,
            blogId: contextId,
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
        updateImage(UPDATE_IMAGE, preUpdateImageFormData, formData.url)
        .then((updateImgRes: any) => {
            const imageUpdateData = createImageUpdateData(preUpdateImageFormData, updateImgRes.data);
            return postRequest(URL_UPDATE_IMAGE_BLOG, imageUpdateData)
        })
        .then((r) => {
            console.log(r)
        })
        .catch((e) => {
            console.log(e)
        })
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
