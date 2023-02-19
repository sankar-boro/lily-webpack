import { setActivePageFn } from "./utils";
import { createVue } from "./common/index";

export const setActivePage = (props: any) => {
    const { ctxProvider, page, pageIndex } = props;
    const { context, dispatch } = ctxProvider;
    const newActivePage = setActivePageFn({
        context,
        compareId: page.uniqueId
    });
    const resetVue = createVue({ docType: 'book', status: 'view '});
    dispatch({
        keys: ['bookCtxNodes', 'vueCtx', 'ctxMeta'],
        values: [newActivePage, resetVue, { type: "page", pageIndex, sectionIndex: null }]
    })
}

export const setActiveSection = (props: any) => {
    const { ctxProvider, section, sectionIndex, pageIndex } = props;
    const { context, dispatch } = ctxProvider;
    const newActivePage = setActivePageFn({
        context,
        compareId: section.uniqueId
    });
    const resetVue = createVue({ docType: 'book', status: 'view '});
    dispatch({
        keys: ['bookCtxNodes', 'vueCtx', 'ctxMeta'],
        values: [newActivePage, resetVue, { type: 'section', sectionIndex, pageIndex }]
    })
}