import React, { useContext, useEffect, useReducer } from "react";
import { AuthContextType } from "lily-types";
import { setters } from './ProvidersCommon';
import { useAuthQuery } from "lily-utils";

const initAuthState: AuthContextType = {
    auth: 'init',
    authUserData: null,
    error: null,
    dispatch: (e: any) => {
        console.log(e)
    }
}

export const AuthContext = React.createContext<AuthContextType>({
    auth: 'init',
    authUserData: null,
    error: null,
    dispatch: (e: any) => {
        console.log(e)
    }
});

export const useAuthContext = () => useContext(AuthContext);

const useAuthenticate = (dispatch: any) => {
    useEffect(() => {
        useAuthQuery(dispatch);
    }, []);
}

export const AuthServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(setters, initAuthState);
    useAuthenticate(dispatch);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                dispatch
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};
