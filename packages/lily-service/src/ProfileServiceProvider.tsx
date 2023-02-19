import React, { useContext, useReducer } from "react";
import { ProfileContextType, HomeActionType } from "lily-types";
import ContextService from "./ProfileServiceProviderFn";
import { setters } from './ProvidersCommon';
import { styles } from './styles';
import { useAuthContext } from "./AuthServiceProvider";

export const ProfileContext = React.createContext<ProfileContextType>({
    books: [],
    booksPage: null,
    blogs: [],
    blogsPage: null,
    title: null,
    vueCtx: 1,
    styles: {},
    error: null,
    authData: null,
    dispatch: (data: any): void => {
        console.log(data)
    },
    service: null,
});

const profileState: ProfileContextType = {
    books: [],
    booksPage: null,
    blogs: [],
    blogsPage: null,
    title: null,
    vueCtx: 1,
    styles,
    error: null,
    authData: null,
    dispatch: (data: any) => {
        console.log(data)
    },
    service: null,
}

export const useProfileContext = () => useContext(ProfileContext);


const reducer = (state: ProfileContextType, action: HomeActionType) => {
    return setters(state, action);
}

export const ProfileServiceProvider = (props: { children: object }) => {
    const authContext = useAuthContext();
    const [state, dispatch] = useReducer(reducer, profileState);
    const service = new ContextService(authContext, dispatch, state);
    return (
        <ProfileContext.Provider
            value={{
                ...state,
                dispatch,
                service,
            }}
        >
            {props.children}
        </ProfileContext.Provider>
    );
};