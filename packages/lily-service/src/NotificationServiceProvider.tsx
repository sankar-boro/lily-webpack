import React, { useContext, useReducer } from "react";
import { NotificationContextType } from "lily-types";
import { setters } from './ProvidersCommon';

export const NotificationContext = React.createContext<NotificationContextType>({
    group: [],
    one: null,
    dispatch: (data: any): void => {
        console.log(data)
    },
});

const notificationState: NotificationContextType = {
    group: [],
    one: null,
    dispatch: (data: any): void => {
        console.log(data)
    },
}

export const useNotificationContext = () => useContext(NotificationContext);

const reducer = (state: NotificationContextType, action: any) => {
    return setters(state, action);
}

export const NotificationServiceProvider = (props: { children: object }) => {
    const [state, dispatch] = useReducer(reducer, notificationState);

    return (
        <NotificationContext.Provider
            value={{
                ...state,
                dispatch
            }}
        >
            {props.children}
        </NotificationContext.Provider>
    );
};