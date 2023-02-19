import { QueryHandler, ALL_CATEGORY, GET_CATEGORY_BOOKS, GET_USER_CATEGORIES, GET_CATEGORY_BLOGS,
    GET_CATEGORY_NEXTBLOGS, GET_CATEGORY_NEXTBOOKS, GET_BOOKS_NEXT, GET_BLOGS_NEXT, GET_BOOK_ALL, GET_BLOG_ALL,
} from "lily-query";
import { GetQuery, PostQuery } from "./ProvidersCommon";

export default class ContextService {
    authContext: any = null;
    dispatch: any = null;

    constructor(authContext: any, dispatch: any) {
        this.authContext = authContext;
        this.dispatch = dispatch;
    }

    loadData = async () => {
        if (this.authContext.auth === 'true') {
            const cat = new CategoriesHandler(this.dispatch, { setCategories: true });
            await cat.getAllCategories();
            await cat.getUserCategories();
            cat.generateSuffix();
            const allCategories = cat.allCategories;
            const userCategories = cat.userCategories;
            const suffix = cat.suffix;
            const home = new HomeContextHandler();
            if (!suffix) {
                this.dispatch({
                    keys: ['allCategories', 'userCategories'],
                    values: [allCategories, userCategories]
                })
                return;
            };
            const bookUrl = `${GET_CATEGORY_BOOKS}${suffix}`;
            const blogUrl = `${GET_CATEGORY_BLOGS}${suffix}`;
            
            const books = await home.getHomeBooks(bookUrl);
            const blogs = await home.getHomeBlogs(blogUrl);
            this.dispatch({
                keys: ['books','booksPage', 'blogs', 'blogsPage', 'suffix', 'allCategories', 'userCategories'],
                values: [books.books, books.bookPagination, blogs.blogs, blogs.blogPagination, suffix, allCategories, userCategories]
            })
        } else if (this.authContext.auth === 'false') {
            const home = new HomeContextHandler();
            const books = await home.getHomeBooks(GET_BOOK_ALL);
            const blogs = await home.getHomeBlogs(GET_BLOG_ALL);
            this.dispatch({
                keys: ['books','booksPage', 'blogs', 'blogsPage'],
                values: [books.books, books.bookPagination, blogs.blogs, blogs.blogPagination]
            })
        }
    }
    loadCategories = async () => {
        const cat = new CategoriesHandler(this.dispatch, { setCategories: true });
        await cat.getAllCategories();
        await cat.getUserCategories();
        this.dispatch({
            keys: ['userCategories','userCategoriesPage', 'allCategories', 'allCategoriesPage'],
            values: [cat.userCategories, cat.userCategoryPage, cat.allCategories, cat.allCategoryPage]
        })
    }
    nextBooks = async (dispatch: any, booksPage: any, books: any, suffix: any) => {
        if (!booksPage) return;
        const home = new HomeContextHandler();
        if (this.authContext.auth === 'true') {
            if (!suffix) return;
            const url = this.authContext.auth === 'true' ? `${GET_CATEGORY_NEXTBOOKS}${suffix}` : GET_BOOKS_NEXT;
            await home.getNextHomeBooks(url, {page:booksPage});
            dispatch({
                keys: ['books','booksPage'],
                values: [[...books, ...home.books], home.bookPagination]
            })
        } else {
            await home.getNextHomeBooks(GET_BOOKS_NEXT, {page:booksPage});
            dispatch({
                keys: ['books','booksPage'],
                values: [[...books, ...home.blogs], home.blogPagination]
            })
        }
    }
    nextBlogs = async (dispatch: any, blogsPage: any, blogs: any, suffix: any) => {
        if (!blogsPage) return;
        const home = new HomeContextHandler();
        if (this.authContext.auth === 'true') {
            if (!suffix) return;
            const url = this.authContext.auth === 'true' ? `${GET_CATEGORY_NEXTBLOGS}${suffix}` : GET_BLOGS_NEXT;
            await home.getNextHomeBlogs(url, {page:blogsPage});
            dispatch({
                keys: ['blogs','blogsPage'],
                values: [[...blogs, ...home.blogs], home.blogPagination]
            })
        } else {
            await home.getNextHomeBlogs(GET_BLOGS_NEXT, {page: blogsPage});
            dispatch({
                keys: ['blogs','blogsPage'],
                values: [[...blogs, ...home.blogs], home.blogPagination]
            })
        }
    }
}

export class CategoriesHandler {
    err: any[] = [];
    suffix: any = null;
    
    userCategories: any[] = [];
    userCategoryPage: any = null;
    allCategories: any[] = [];
    allCategoryPage: any = null;

    page: any = null;
    dispatch: any = null;
    options: any = null;

    constructor(dispatch: any, options = { setCategories: false }) {
        this.dispatch = dispatch;
        this.options = options;
    }

    getUserCategories(): Promise<CategoriesHandler> {
        return new Promise((resolve) => {
            new QueryHandler(undefined)
            .setAuth(true)
            .setUrl(GET_USER_CATEGORIES)
            .run()
            .then((res: any) => {
                if (res.data && res.data.categories) {
                    this.userCategories = res.data.categories;
                    this.userCategoryPage = res.data.page;
                }
                resolve(this);
            })
            .catch((err) => {
                this.err.push(err.response);
                resolve(this)
            });
        });
    }

    getAllCategories(): Promise<CategoriesHandler> {
        return new Promise((resolve) => {
            new QueryHandler(undefined)
            .setAuth(true)
            .setUrl(ALL_CATEGORY)
            .run()
            .then((res: any) => {
                if (res.data && res.data.categories && res.data.categories.length > 0) {
                    if (res.data && res.data.categories) {
                        this.allCategories = res.data.categories;
                        this.allCategoryPage = res.data.page;
                    }
                }
                resolve(this);
            })
            .catch((err) => {
                this.err.push(err.response);
                resolve(this)
            });
        });
    }

    generateSuffix() {
        let suffix = ``;
        this.userCategories.forEach((c: any, i: number) => {
            if (i === 0) {
                suffix = `${c.category}`;
            } else {
                suffix = `${suffix}-${c.category}`;
            }
        });
        this.suffix = suffix;
    }
}

class HomeContextHandler {
    books: any[] = [];
    bookPagination: any = null;
    blogs: any[] = [];
    blogPagination: any = null;
    err: any[] = [];

    getHomeBooks(url: string): Promise<HomeContextHandler> {
        return new Promise((resolve) => {
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
                this.err.push(err);
                resolve(this)
                // reject(this);
            });
        });
    }

    getNextHomeBooks(url: string, formData: any): Promise<HomeContextHandler> {
        return new Promise((resolve) => {
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
                this.err.push(err);
                resolve(this)
                // reject(this);
            });
        });
    }

    getHomeBlogs(url: string): Promise<HomeContextHandler> {
        return new Promise((resolve) => {
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
                this.err.push(err)
                resolve(this)
                // reject(this);
            });
        });
    }

    getNextHomeBlogs(url: string, formData: any): Promise<HomeContextHandler> {
        return new Promise((resolve) => {
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
                this.err.push(err)
                resolve(this)
                // reject(this);
            });
        });
    }
}
