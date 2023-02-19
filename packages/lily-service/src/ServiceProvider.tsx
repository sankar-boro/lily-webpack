import React, { useContext, useEffect, useReducer } from "react";
import { ServiceProviderContextType } from 'lily-types';
import { setters } from './ProvidersCommon';
import { BookHandler } from "./BookService";
import { BlogHandler } from "./BlogService";
import { initContext, createVue } from './utils';
import { useLocation } from "react-router-dom";

export const ServiceProviderContext = React.createContext<ServiceProviderContextType>(initContext);

export const useServiceProviderContext = () => useContext(ServiceProviderContext);

const getContextId = (dispatch: any, location: any) => {
    const { state: historyState, pathname }: any = location;
    if (!historyState && pathname) {
        const splitPathName: any[] = pathname.split('/').filter((t: string) => t);
        if (splitPathName.includes('book')) {
            const docVue = createVue({ status: 'none', docType: 'book' });
            dispatch({
                keys: ['contextId', 'service', 'vueCtx'],
                values: [splitPathName[splitPathName.length - 1], new BookHandler(), docVue]
            })
        }
        if (splitPathName.includes('blog')) {
            const docVue = createVue({ status: 'none', docType: 'blog' });
            dispatch({
                keys: ['contextId', 'service', 'vueCtx'],
                values: [splitPathName[splitPathName.length - 1], new BlogHandler(), docVue]
            })
        }
    }
    if (historyState && (historyState.bookId || historyState.blogId)) {
        const contextId = historyState.bookId || historyState.blogId;
        if (historyState.bookId) {
            const docVue = createVue({ status: 'none', docType: 'book' });
            dispatch({
                keys: ['contextId', 'service', 'vueCtx'],
                values: [contextId, new BookHandler(), docVue]
            })
        }
        if (historyState.blogId) {
            const docVue = createVue({ status: 'none', docType: 'blog' });
            dispatch({
                keys: ['contextId', 'service', 'vueCtx'],
                values: [contextId, new BlogHandler(), docVue]
            })
        }
    }
}

export const ServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(setters, initContext);
    const location = useLocation();
    useEffect(() => getContextId(dispatch, location), []);
    return (
        <ServiceProviderContext.Provider
            value={{
                ...state,
                dispatch
            }}
        >
            {props.children}
        </ServiceProviderContext.Provider>
    );
};
