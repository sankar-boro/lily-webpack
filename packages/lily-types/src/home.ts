import { Page, DefaultActionType } from './index';

export enum HOME_SERVICE {
    SETTERS = 'SETTERS',
}
export type HomeContextType = {
    books: any[],
    booksPage: any,
    blogs: any[],
    blogsPage: any,
    userCategories: any,
    userCategoriesPage: any,
    allCategories: any,
    allCategoriesPage: any,
    suffix: any,
    title: null | string,
    vueCtx: any,
    styles: any,
    error: any,
    dispatch: (data: any) => void,
    service: any,
    modalCtx: any,
    isMobile: any,
    others: any,
}
export type ProfileContextType = {
    books: any[],
    booksPage: any,
    blogs: any[],
    blogsPage: any,
    // allcategories: any[],
    // allcategoriesPage: any,
    // usercategories: any[],
    // usercategoriesPage: any,
    // addcategories: any[],
    title: null | string,
    vueCtx: null | number,
    styles: any,
    error: any,
    authData: any,
    dispatch: (data: any) => void,
    service: any,
}
export type HomeActionType = DefaultActionType;