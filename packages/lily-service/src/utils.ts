export const initVue = {
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
    docType: null,
    status: null,
}

export const initContext = {
    api: null,
    titles: null,
    context: null,
    contextData: null,
    bookContext: null,
    blogContext: null,
    contextId: null,
    authorId: null,
    formCtx: {},
    errorCtx: '',
    vueCtx: initVue,
    modalCtx: null,
    dispatch: (data: any): void => {
        console.log(data)
    },
    service: null,
    search: null,
    others: { pnView: 'no_nav'}
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

export const createServiceContext = (vueCtx: any) => {
    return {
        api: null,
        context: null,
        contextId: null,
        bookCtxNodes: null,
        formCtx: {},
        errorCtx: '',
        vueCtx,
        modalCtx: null,
        dispatch: (data: any): void => {
            console.log(data)
        },
        service: null,
        search: null,
    };
}