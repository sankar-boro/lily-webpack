import { GET_AUTHOR_NEXTBLOGS, GET_AUTHOR_NEXTBOOKS, GET_AUTHOR_BOOKS, GET_AUTHOR_BLOGS } from "lily-query";
import { GetQuery, PostQuery } from "./ProvidersCommon";

export default class ContextService {
    authContext: any = null;
    dispatch: any = null;
    state: any = null;

    constructor(authContext: any, dispatch: any, state: any) {
        this.authContext = authContext;
        this.dispatch = dispatch;
        this.state = state;
    }
    loadData = async () => {
        if (!this.authContext) return;
        if (!this.authContext.authUserData) return;
        const { authUserData } = this.authContext;
        const home = new ProfileContextHandler(authUserData);
        const bookUrl = `${GET_AUTHOR_BOOKS}${authUserData.userId}`;
        const blogUrl = `${GET_AUTHOR_BLOGS}${authUserData.userId}`;

        const books = await home.getHomeBooks(bookUrl);
        const blogs = await home.getHomeBlogs(blogUrl);
        this.dispatch({
            keys: ['books','booksPage', 'blogs', 'blogsPage'],
            values: [books.books, books.bookPagination, blogs.blogs, blogs.blogPagination]
        })
    }
    nextBooks = async (dispatch: any, booksPage: any, books: any) => {
        if (!booksPage) return;
        if (!this.authContext || !this.authContext.authUserData) return;
        const { userId } = this.authContext.authUserData;
        const url = `${GET_AUTHOR_NEXTBOOKS}${userId}`;
        const pro = new ProfileContextHandler(this.authContext.authUserData);
        await pro.getNextHomeBooks(url, { page: booksPage });
        dispatch({
            keys: ['books','booksPage'],
            values: [[...books, ...pro.books], pro.bookPagination]
        })
    }
    nextBlogs = async (dispatch: any, blogsPage: any, blogs: any) => {
        if (!blogsPage) return;
        if (!this.authContext || !this.authContext.authUserData) return;
        const { userId } = this.authContext.authUserData;
        const url = `${GET_AUTHOR_NEXTBLOGS}${userId}`;
        const pro = new ProfileContextHandler(this.authContext.authUserData);
        await pro.getNextHomeBlogs(url, { page: blogsPage });
        dispatch({
            keys: ['blogs', 'blogsPage'],
            values: [[...blogs, ...pro.blogs], pro.blogPagination]
        })
    }
}

class ProfileContextHandler {
    books: any[] = [];
    bookPagination: any = null;
    blogs: any[] = [];
    blogPagination: any = null;

    err: any[] = [];
    authUserData: any = null;

    constructor(authUserData: any) {
        this.authUserData = authUserData;
    }

    getHomeBooks(url: string): Promise<ProfileContextHandler> {
        return new Promise(async (resolve, reject) => {
            new GetQuery()
            .query(url)
            .then((res: any) => {
                if (
                    res.status &&
                    res.status === 200
                ) {
                    this.books = res.data.books;
                    this.bookPagination = res.data.page;
                    resolve(this);
                }
            })
            .catch((err: any) => {
                this.err.push(err.response);
                reject(this);
            });
        });
    }

    getNextHomeBooks(url: string, formData: any): Promise<ProfileContextHandler> {
        if (!formData) return Promise.reject(this);
        return new Promise(async (resolve, reject) => {
            new PostQuery()
            .query(url, formData)
            .then((res: any) => {
                if (
                    res.status &&
                    res.status === 200
                ) {
                    this.books = res.data.books;
                    this.bookPagination = res.data.page;
                    resolve(this);
                }
            })
            .catch((err: any) => {
                this.err.push(err.response);
                reject(this);
            });
        });
    }

    getHomeBlogs(url: string): Promise<ProfileContextHandler> {
        return new Promise(async (resolve, reject) => {
            new GetQuery()
            .query(url)
            .then((res: any) => {
                if (
                    res.status &&
                    res.status === 200
                ) {
                    this.blogs = res.data.blogs;
                    this.blogPagination = res.data.page;
                    resolve(this);
                }
            })
            .catch((err: any) => {
                this.err.push(err.response);
                reject(this);
            });
        });
    }

    getNextHomeBlogs(url: string, formData: any): Promise<ProfileContextHandler> {
        if (!formData) return Promise.reject(this);
        return new Promise(async (resolve, reject) => {
            new PostQuery()
            .query(url, formData)
            .then((res: any) => {
                if (
                    res.status &&
                    res.status === 200
                ) {
                    this.blogs = res.data.blogs;
                    this.blogPagination = res.data.page;
                    resolve(this);
                }
            })
            .catch((err: any) => {
                this.err.push(err.response);
                reject(this);
            });
        });
    }
}
