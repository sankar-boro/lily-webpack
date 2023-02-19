import { APPEND_BOOK_NODE, MERGE_BOOK_NODE, UPLOAD_IMAGE } from 'lily-query';
import { getContext } from 'lily-web/common';
import { createVue, postRequest, uploadImage } from "../index";
import { getSubSectionIds } from "../common";

const log = false;

const generateContextNode = (props: any, newNode: any, node105: any) => {
    const { ctxProvider, node106 } = props;
    const { context, bookContext } = ctxProvider;
    const { node104UniqueId, nodeIndex105 } = bookContext;

    const node104 = context[node104UniqueId];
    let subSections = node105.child;
    
    if (node106 === null && subSections.length === 0) {
        subSections = [newNode];
    } else if (node106 === null && subSections.length > 0) {
        const firstTitle = subSections[0];
        const otherTitles = subSections.splice(1);
        subSections = [newNode, {...firstTitle, parentId: newNode.uniqueId }, ...otherTitles];
    } else if (node106 && subSections.length > 0) {
        const thisTitles: any = [];
        let done = false;
        subSections.forEach((subSection: any) => {
            if (subSection.uniqueId === node106.uniqueId) {
                thisTitles.push(subSection);
                thisTitles.push(newNode);
                done = true;
            } else if (done) {
                thisTitles.push({ ...subSection, parentId: newNode.uniqueId });
                done = false;
            } else {
                thisTitles.push(subSection);
            }
        })
        subSections = thisTitles;
    }

    node104.child[nodeIndex105].child = subSections;
    return node104;
}

const sectionDispatcher = (props: any, bookSumitData: any, afterBookSubmitData: any, node105: any) => {
    const { ctxProvider, notifProvider } = props;
    const { dispatch: notifDispatch } = notifProvider;
    const { context, dispatch, bookContext } = ctxProvider;
    const { node104UniqueId, nodeIndex105 } = bookContext;
    const node104 = context[node104UniqueId]
    const pageUniqueId = node104.uniqueId;
    const { topUniqueId, ...bsd } = bookSumitData;
    const newNode = { ...bsd };
    newNode.uniqueId = afterBookSubmitData.uniqueId;
    newNode.pageId = afterBookSubmitData.pageId;
    newNode.parentId = topUniqueId;
    newNode.child = [];

    const newNodes = generateContextNode(props, newNode, node105);
    context[pageUniqueId] = newNodes;
    const newMainNode = newNodes.child[nodeIndex105];
    const vue=  createVue({ docType: 'book', status: 'view'})
    dispatch({
        keys: ['context', 'bookContext', 'vueCtx', 'modalCtx'],
        values: [context, { ...bookContext, mainNode: newMainNode, childNodes: newMainNode.child, category: newNode }, vue, null]
    })
    notifDispatch({
        keys:['one'],
        values: [{data: [{title: 'Created Sub Section.', value: '' }], status: 'success' }]
    })
}

export const getContextAndCreateSubSection = (props: any) => {
    getContext(props).then((r: any) => {
        console.log(r)
        createSubSection(props);
    });
}

const createSubSection = (props: any) => {
    const { ctxProvider } = props;
    const { vueCtx, dispatch, contextId, bookContext } = ctxProvider
    const { node104UniqueId } = bookContext;
    const identity = 106;
    const formData = { 
        titleLabel: 'Sub Section Name/Title',
        bodyLabel: 'Sub Section Name/Description',
        titleValue: '',
        bodyValue: '',
        method: 'create', 
        identity 
    }
    props.method = 'create';
    const node105 = { ...bookContext.mainNode, child: bookContext.childNodes };
    props.node105 = node105;
    const updateIds = getSubSectionIds(props);
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
            pageId: node104UniqueId
        }
        if (botUniqueId) {
            d.botUniqueId = botUniqueId;
        }
        return d;
    }
    let bookSubmitData: any = null;
    const onSubmit = (preFormData: any) => {
        if (!log) {
            uploadImage(UPLOAD_IMAGE, preFormData)
            .then((postImgRes: any) => {
                bookSubmitData = createPageSubmitData(preFormData, postImgRes.data);
                return postRequest(url, bookSubmitData)
            })
            .then((postCreateData: any) => {
                sectionDispatcher(props, bookSubmitData, postCreateData.data, node105);
            })
            .catch((e: any) => {
                console.log(e);
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
    
    const onCallBack = (preFormData: any) => {
        showModal(preFormData);
    }
    const showModal = (preFormData: any) => {
        dispatch({
            keys: ['modalCtx'],
            values: [{
                data: { method: 'create' },
                title: 'Create',
                node: { ...preFormData, identity: 106 },
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