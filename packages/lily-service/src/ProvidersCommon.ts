import { AuthActionType } from "lily-types";
import { QueryHandler } from "lily-query";

export class GetQuery {
    query(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            new QueryHandler(undefined)
            .setAuth(true)
            .setUrl(url)
            .run()
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }
}

export class PostQuery {
    query(url: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            new QueryHandler(undefined)
            .setAuth(true)
            .setUrl(url)
            .setMethod('post')
            .setFormData(data)
            .run()
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }
}

export const setters = (state: any, action: AuthActionType) => {
    const { keys, values } = action;
    if (keys && values && keys.length === values.length) {
        if (keys.length === values.length) {
            const updateData: any = {};
            keys.forEach((keyName: string, keyIndex: any) => {
                if (state.hasOwnProperty(keyName)) {
                    updateData[keyName] = values[keyIndex];
                }
            })
            return {
                ...state,
                ...updateData
            };
        }
    }
    return state;
}