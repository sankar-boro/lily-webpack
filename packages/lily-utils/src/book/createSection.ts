import { APPEND_BOOK_NODE, MERGE_BOOK_NODE, UPLOAD_IMAGE } from 'lily-query';
import { getContext } from 'lily-web/common';
import { createVue, postRequest, uploadImage } from "../index";
import { getSectionIds } from "../common";

const generateTitles = (props: any, newNode: any) => {
    const { node104, node105, titleNodes, nodeIndex104 } = props;
    let nodeIndex105 = 0;
    if (node105 === null && node104.child.length === 0) {
        const { bookId, identity, parentId, title, uniqueId } = newNode;
        titleNodes[nodeIndex104].child = [{bookId, identity, parentId, title, uniqueId, child: [] }];
        return [titleNodes, nodeIndex105];
    }
    if (node105 === null && node104.child.length > 0) {
        const thisTitles = node104.child;
        const firstTitle = thisTitles[0];
        const otherTitles = node104.child.splice(1);
        const { bookId, identity, parentId, title, uniqueId } = newNode;
        titleNodes[nodeIndex104].child = [{ bookId, identity, parentId, title, uniqueId, child: [] }, {...firstTitle, parentId: uniqueId }, ...otherTitles];
        return [titleNodes, nodeIndex105];
    }
    if (node105 && node104.child.length > 0) {
        const thisTitles: any = [];
        let done = false;
        node104.child.forEach((secTitle: any, sI: number) => {
            if (secTitle.uniqueId === node105.uniqueId) {
                thisTitles.push(secTitle);
                thisTitles.push(newNode);
                nodeIndex105 = sI + 1;
                done = true;
            } else if (done) {
                thisTitles.push({ ...secTitle, parentId: newNode.uniqueId });
                done = false;
            } else {
                thisTitles.push(secTitle);
            }
        })
        titleNodes[nodeIndex104].child = thisTitles;
        return [titleNodes, nodeIndex105];
    }
}

const generateNode105 = (props: any, newNode: any) => {
    const pageId = props.node104.uniqueId;
    const { node105, ctxProvider } = props;
    const { context } = ctxProvider;
    const node104 = context[pageId];
    if (node105 === null && node104.child.length === 0) {
        node104.child = [newNode];
        return node104;
    }
    if (node105 === null && node104.child.length > 0) {
        const thisNodes = node104.child;
        const firstNode = thisNodes[0];
        const otherNodes = node104.child.splice(1);
        node104.child = [newNode, {...firstNode, parentId: newNode.uniqueId }, ...otherNodes];
        return node104;
    }
    if (node105 && node104.child.length > 0) {
        const thisNodes: any = [];
        let done = false;
        node104.child.forEach((secNode: any) => {
            if (secNode.uniqueId === node105.uniqueId) {
                thisNodes.push(secNode);
                thisNodes.push(newNode);
                done = true;
            } else if (done) {
                thisNodes.push({ ...secNode, parentId: newNode.uniqueId });
                done = false;
            } else {
                thisNodes.push(secNode);
            }
        })
        node104.child = thisNodes;
        return node104;
    }
}

const sectionDispatcher = (props: any, bookSumitData: any, afterBookSubmitData: any) => {
    const { ctxProvider, notifProvider, node104 } = props;
    const { dispatch: notifDispatch} = notifProvider;
    const { context, dispatch, bookContext } = ctxProvider;
    const pageUniqueId = node104.uniqueId;
    const { topUniqueId, ...bsd } = bookSumitData;
    const newNode = { ...bsd };
    newNode.uniqueId = afterBookSubmitData.uniqueId;
    newNode.pageId = afterBookSubmitData.pageId;
    newNode.parentId = topUniqueId;
    newNode.child = [];
    const [newTitles, nodeIndex105]: any = generateTitles(props, newNode);
    const newNodes = generateNode105(props, newNode);
    context[pageUniqueId] = newNodes;
    const vue=  createVue({ docType: 'book', status: 'view'})
    dispatch({
        keys: ['context', 'bookContext', 'titles', 'vueCtx', 'modalCtx'],
        values: [context, {...bookContext, mainNode: newNode, childNodes: [], category: newNode, nodeIndex105 }, newTitles, vue, null]
    })
    notifDispatch({
        keys:['one'],
        values: [{data: [{title: 'Created Section.', value: '' }], status: 'success' }]
    })
}

export const getContextAndCreateSection = (props: any) => {
    getContext(props).then((r: any) => {
        console.log(r)
        createSection(props);
    });
}

const createSection = (props: any) => {
    const { ctxProvider, node104 } = props
    props.method = 'create';
    const pageId = node104.uniqueId;
    const { vueCtx, dispatch, contextId } = ctxProvider
    const identity = 105;
    const formData = { 
        titleLabel: 'Section Name/Title',
        bodyLabel: 'Section Name/Description',
        titleValue: '',
        bodyValue: '',
        method: 'create', 
        identity 
    }
    const updateIds = getSectionIds(props);
    const { topUniqueId, botUniqueId } = updateIds;
    const url = botUniqueId ? MERGE_BOOK_NODE : APPEND_BOOK_NODE;
    const createPageSubmitData = (f: any, i: any) => {
        const { title, body, metadata, category } = f;
        const d: any = {
            title,
            body,
            metadata,
            category,
            image_url: i ? JSON.stringify(i) : null,
            identity,
            topUniqueId,
            bookId: contextId,
            pageId
        }
        if (botUniqueId) {
            d.botUniqueId = botUniqueId;
        }
        return d;
    }
    let bookSubmitData: any = null;
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

    const onCallBack = (preFormData: any) => {
        showModal(preFormData);
    }

    const onSubmit = (preFormData: any) => {
        uploadImage(UPLOAD_IMAGE, preFormData)
        .then((postImgRes: any) => {
            bookSubmitData = createPageSubmitData(preFormData, postImgRes.data);
            return postRequest(url, bookSubmitData)
        })
        .then((postCreateData: any) => {
            sectionDispatcher(props, bookSubmitData, postCreateData.data);
        })
        .catch((e: any) => {
            console.log(e);
        })
    }

    const showModal = (preFormData: any) => {
        dispatch({
            keys: ['modalCtx'],
            values: [{
                data: { method: 'create' },
                title: 'Create',
                node: { ...preFormData, identity: 105 },
                updateIds,
                childNodes: [],
                actions: {
                    createHandle: () => { onSubmit(preFormData)}
                }
            }]
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