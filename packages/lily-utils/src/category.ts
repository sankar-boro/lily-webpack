import { ADD_CATEGORY, DELETE_CATEGORY, QueryHandler } from "lily-query";

export const addCategory = (category: any, userCategories: any, allCategories: any, setUserCategories: any, setAllCategories: any) => {
    new QueryHandler(undefined)
    .setAuth(true)
    .setUrl(ADD_CATEGORY)
    .setMethod('post')
    .setFormData({ category })
    .run()
    .then((res: any) => {
        console.log(res)
        const x = allCategories.filter((e: any) => {
            if (e.category === category) {
                return false; 
            }
            return true;
        })
        const y = [...userCategories, { category }];
        setAllCategories(x);
        setUserCategories(y);
    })
    .catch((err: any) => {
        console.log(err, 'err');
    });
}

export const deleteCategory = (category: any, userCategories: any, allCategories: any, setUserCategories: any, setAllCategories: any) => {
    const x = userCategories.filter((e: any) => {
        if (e.category === category) {
            return false; 
        }
        return true;
    })
    const y = [...allCategories, { category }];
    setAllCategories(y);
    setUserCategories(x);

    new QueryHandler(undefined)
    .setAuth(true)
    .setUrl(DELETE_CATEGORY)
    .setMethod('post')
    .setFormData({ category })
    .run()
    .then((res: any) => {
        console.log(res, 'added.');
    })
    .catch((err: any) => {
        console.log(err, 'err');
    });
}