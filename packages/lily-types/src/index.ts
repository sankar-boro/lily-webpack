export * from "./form";
export * from "./auth";
export * from "./home";

export const constants = {
    IDLE: 100,
    RESULT: 200,
    WAITING: 300,
    LOCKED: 409,
    heights: {
        fromTopNav: {
            leftBar: 35,
            rightBar: 35,
            topBar: 45,

        }
    }
}
export const ENV = {
    LOG: true,
}
export type Common = {
    bookId: string;
    body: string;
    identity: number;
    title: string;
    uniqueId: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    metadata: string | null;
    url: string | null;
}
export type ParentId = {
    parentId: string;
}

/** Book */
export type SubSection =  Common & ParentId;
export type SubSections = SubSection[];
type SectionChildNodes = {
    child: SubSections,
}
export type Section = Common & ParentId & SectionChildNodes;
export type Sections = Section[];
type PageChildNodes = {
    child: Sections,
}

/** */
export type Page = Common & ParentId & PageChildNodes;
export type RootPage = Common;
export type Book = (RootPage | Page)[];
export type BookApiRes = (Common & ParentId | Common)[];
export type ContextPageBook = RootPage | Page | Section;

/** Blog */
export type Blog = (RootPage | Common & ParentId)[];
export type BlogApiRes = (RootPage | Common & ParentId)[];
export type ContextPageBlog = RootPage | Common & ParentId;

export const textareaRows = 10;
export const textareaCols = 50;
export type DefaultActionType = {
    keys: any[],
    values: any[],
}
export enum NODE_TYPE {
    FRONT_COVER = "FRONT_COVER",
    BACK_COVER = "BACK_COVER",
    PAGE = "PAGE",
    CHAPTER = "CHAPTER",
    SECTION = "SECTION",
    SUB_SECTION = "SUB_SECTION",
}
export enum HTTP_METHODS {
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    PUT    = 'PUT'
}
export enum VUE {
    FORM = 'FORM',
    DOCUMENT = 'DOCUMENT',
    NONE = 'NONE',
    MODAL = 'MODAL'
}

export const getFormType = (num: number) => {
    switch (num) {
        case 101:
            return NODE_TYPE.FRONT_COVER;
        case 104:
            return NODE_TYPE.PAGE;
        case 105:
            return NODE_TYPE.SECTION;
        case 106:
            return NODE_TYPE.SUB_SECTION;
        default:
            return "NONE";
    }
}

export type ServiceProviderContextType = {
    authorId: any,
    api: any,
    bookContext: any,
    blogContext: any,
    contextId: any,
    context: any,
    contextData: any,
    errorCtx: any,
    formCtx: any,
    modalCtx: any,
    service: any,
    search: any
    titles: any,
    vueCtx: any,
    dispatch: (res: any) => void,
}

export type EditServiceProviderContextType = {
    authorId: any,
    api: any,
    bookContext: any,
    blogContext: any,
    contextId: any,
    context: any,
    contextData: any,
    errorCtx: any,
    formCtx: any,
    modalCtx: any,
    service: any,
    search: any
    titles: any,
    vueCtx: any,
    others: any,
    dispatch: (res: any) => void,
}

export type NotificationContextType = {
    group: any,
    one: any,
    dispatch: any,
}