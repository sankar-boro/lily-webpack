import { APPEND_BOOK_NODE, MERGE_BOOK_NODE, UPLOAD_IMAGE } from 'lily-query';
import { getContext } from 'lily-web/common';
import { createVue, postRequest, uploadImage, LOG } from "../index";
import { getPageIds } from "../common";

const errorPageDispatcher = (props: any, res: any) => {
    const one = JSON.stringify(res);
    const { notifProvider, ctxProvider } = props;
    const { dispatch } = ctxProvider;
    const { dispatch: notifDispatch } = notifProvider;
    const vue = createVue({ docType: 'book', status: 'view'})
    dispatch({
        keys: ['modalCtx', 'vueCtx'],
        values: [null, vue]
    })
    notifDispatch({
        keys: ['one'],
        values: [{data: [{title: 'Failed', value: one }], status: 'error'}],
    })
}

const pageDispatcher = (props: any, bookSumitData: any, afterBookSubmitData: any) => {
    const { ctxProvider, notifProvider } = props;
    const { context, dispatch, titles } = ctxProvider;
    const { dispatch: notifDispatch } = notifProvider;
    const newNode = bookSumitData;
    newNode.uniqueId = afterBookSubmitData.uniqueId;
    newNode.pageId = afterBookSubmitData.pageId;
    newNode.parentId = bookSumitData.topUniqueId;
    newNode.child = [];

    const newContext = context;
    newContext[newNode.uniqueId] = newNode
    const newTitles: any = [];
    let done = false;

    const { topUniqueId: xx, botUniqueId: yy, ...ot } = newNode;
    console.log(xx, yy);
    const NewNode = { ...ot };

    let nodeIndex104 = null;
    let node104UniqueId = null;
    titles.forEach((title: any, tI: number) => {
        if (title.uniqueId === newNode.topUniqueId) {
            newTitles.push(title);
            newTitles.push(NewNode);
            nodeIndex104 = tI + 1;
            node104UniqueId = NewNode.uniqueId;
            done = true;
        } else if (done){
            newTitles.push({ ...title, parentId: newNode.uniqueId });
            done = false;
        } else {
            newTitles.push(title);
        }
    })
    const bookView = createVue({ status: 'view', docType: 'book' });
    const values = [newContext, { mainNode: NewNode, childNodes: [], category: NewNode, nodeIndex104, node104UniqueId }, newTitles, bookView, null];
    dispatch({
        keys: ['context', 'bookContext', 'titles', 'vueCtx', 'modalCtx'],
        values
    })

    notifDispatch({
        keys:['one'],
        values: [{data: [{title: 'Created Page.', value: '' }], status: 'success' }]
    })
}

export const getContextAndCreatePage = (props: any) => {
    getContext(props).then((r: any) => {
        console.log(r)
        createPage(props);
    });
}

const createPage = (props: any) => {
    const { ctxProvider, titleNodes, nodeIndex104 } = props
    const { vueCtx, dispatch, contextId } = ctxProvider
    const formData = { 
        titleLabel: 'Chapter Name',
        bodyLabel: 'Chapter Description',
        titleValue: '',
        bodyValue: '',
        method: 'create', 
        identity: 104 
    }
    const updateIds = getPageIds({
        method: 'create',
        titleNodes,
        nodeIndex: nodeIndex104, 
    });
    const { topUniqueId, botUniqueId } = updateIds;
    const url = botUniqueId ? MERGE_BOOK_NODE : APPEND_BOOK_NODE;
    const createPageSubmitData = (f: any, i: any) => {
        const { title, body, metadata, category } = f;
        return {
            title,
            body,
            metadata,
            category,
            image_url: i ? JSON.stringify(i) : null,
            identity: 104,
            topUniqueId,
            botUniqueId,
            bookId: contextId,
        }
    }
    let bookSubmitData: any = null;
    const onCallBack = (preFormData: any) => {
        console.log('onCa')
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
                bookSubmitData = createPageSubmitData(preFormData, postImgRes.data);
                return postRequest(url, bookSubmitData)
            })
            .then((postCreateData: any) => {
                pageDispatcher(props, bookSubmitData, postCreateData.data);
            })
            .catch((e: any) => {
                console.log(e);
                errorPageDispatcher(props, e);
            }) 
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