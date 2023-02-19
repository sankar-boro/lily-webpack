import { QueryHandler, USER_SESSION } from "lily-query";

export const useAuthQuery = (dispatch: any) => {
    new QueryHandler(undefined)
    .getWithAuthCreds(USER_SESSION)
    .then((res) => {
        let auth = 'false'; 
        let data = null;
        if (res.status === 200 && res.data) {
            auth = 'true';
            data = res.data;
        }
        dispatch({
            keys: ['auth', 'authUserData'],
            values: [auth, data]
        })
    })
    .catch(() => {
        dispatch({
            keys: ['auth', 'authUserData'],
            values: ['false', null]
        })
    })
}