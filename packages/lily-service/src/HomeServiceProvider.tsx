import React, { useContext, useReducer } from "react";
import { HomeContextType, HomeActionType } from "lily-types";
import ContextService from "./HomeServiceProviderFn";
import { setters } from './ProvidersCommon';
import { styles } from './styles';
import { useAuthContext } from "./AuthServiceProvider";

export const HomeContext = React.createContext<HomeContextType>({
    books: [],
    booksPage: null,
    blogs: [],
    blogsPage: null,
    userCategories: [],
    userCategoriesPage: null,
    allCategories: [],
    allCategoriesPage: null,
    suffix: null,
    title: null,
    vueCtx: 'null',
    styles,
    error: null,
    dispatch: (data: any): void => {
        console.log(data);
    },
    service: null,
    modalCtx: null,
    isMobile: 'null',
    others: { pnView: 'no_nav'}
});

const homeState: HomeContextType = {
    books: [],
    booksPage: null,
    blogs: [],
    blogsPage: null,
    userCategories: [],
    userCategoriesPage: null,
    allCategories: [],
    allCategoriesPage: null,
    suffix: null,
    title: null,
    vueCtx: 'null',
    styles,
    error: null,
    dispatch: (data: any) => {
        console.log(data)
    },
    service: null,
    modalCtx: null,
    isMobile: 'null',
    others: { pnView: 'no_nav'},
}

export const useHomeContext = () => useContext(HomeContext);

const reducer = (state: HomeContextType, action: HomeActionType) => {
    return setters(state, action);
}

const debounce = (fn: () => void, ms: any) => {
    let timer: any;
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        fn.apply(null); 
      }, ms)
    };
}

export const HomeServiceProvider = (props: { children: object }) => {
    const aContext = useAuthContext();
    const [state, dispatch] = useReducer(reducer, homeState);
    const service = new ContextService(aContext, dispatch);
    const [isMobile, setIsMobile] = React.useState('null')
    
    React.useEffect(() => {
        if (screen.width < 756) {
            setIsMobile('true');
        }
        if (screen.width > 756) {
            setIsMobile('false');
        }
        const handleResize = (): void => {
            if (screen.width < 756) {
                setIsMobile('true');
            }
            if (screen.width > 756) {
                setIsMobile('false');
            }
        }
        const debouncedHandleResize = debounce(handleResize, 500)
    
        window.addEventListener('resize', debouncedHandleResize)
    
        return () => {
            window.removeEventListener('resize', debouncedHandleResize)
        }
    })

    return (
        <HomeContext.Provider
            value={{
                ...state,
                dispatch,
                service,
                isMobile,
            }}
        >
            {props.children}
        </HomeContext.Provider>
    );
};