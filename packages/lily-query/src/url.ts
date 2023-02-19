const https = process.env.HTTPS === "true" ? "https" : "http"
const http = `${https}://${process.env.LILY}`;
const httpPost = `${https}://${process.env.LILY_POST}`;
export const httpImage = `${https}://${process.env.LILY_IMAGE}`;

export const GET_BOOK_ALL = `${http}/books`;
export const GET_BOOKS_NEXT = `${http}/books/next`;

export const GET_CATEGORY_BOOKS = `${http}/book/category/`;
export const GET_CATEGORY_BLOGS = `${http}/blog/category/`;
export const GET_CATEGORY_NEXTBOOKS = `${http}/book/next_category/`;
export const GET_CATEGORY_NEXTBLOGS = `${http}/blog/next_category/`;


export const CREATE_NEW_BOOK = `${httpPost}/book/create`;
export const CREATE_SESSIONV2 = `${http}/create/sessionv2`;
export const UPDATE_BOOK = `${httpPost}/book/update`;
export const CREATE_PULL_BOOK_NODE = `${http}/booknode/pull_request`;
export const DELETE_BOOK = `${httpPost}/book/delete`;
export const GET_BOOK_TITLES = `${http}/book/titles/`;


export const DELETE_BOOK_NODE = `${httpPost}/booknode/delete`;
export const DELETE_AND_UPDATE_BOOK_NODE = `${httpPost}/booknode/delete/update`;
export const MERGE_BOOK_NODE = `${httpPost}/booknode/merge`;
export const APPEND_BOOK_NODE = `${httpPost}/booknode/create`;
export const UPDATE_BOOK_NODE = `${httpPost}/booknode/update`;

export const GET_BOOK_FROM_ID = `${http}/book/get/`;
export const GET_PAGENODES_FROM_ID = `${http}/book/getPageNodes/`;

export const GET_BOOK_NEXT_PAGE_ID = `${http}/book/nextpage/`;
export const LOGOUT = `${http}/auth/logout`;
export const LOGIN = `${http}/login`;
export const SIGNUP = `${http}/signup`;
export const USER_SESSION = `${http}/user/session`;
export default null;


export const GET_BLOG_ALL = `${http}/blogs`;
export const GET_BLOGS_NEXT = `${http}/blogs/next`;
export const CREATE_NEW_BLOG = `${httpPost}/blog/create`;
export const UPDATE_BLOG = `${httpPost}/blog/update`;
export const DELETE_BLOG = `${httpPost}/blog/delete`;

export const GET_BLOG_FROM_ID = `${http}/blog/get/`;
export const GET_BLOG_NEXT_PAGE_ID = `${http}/blog/nextpage/`;
export const DELETE_BLOG_NODE = `${httpPost}/blognode/delete`;
export const DELETE_AND_UPDATE_BLOG_NODE = `${httpPost}/blognode/delete/update`;
export const MERGE_BLOG_NODE = `${httpPost}/blognode/merge`;
export const APPEND_BLOG_NODE = `${httpPost}/blognode/create`;
export const UPDATE_BLOG_NODE = `${httpPost}/blognode/update`;

/** Author */
export const GET_AUTHOR_BOOKS = `${http}/author/books/get/`;
export const GET_AUTHOR_BLOGS = `${http}/author/blogs/get/`;
export const GET_AUTHOR_NEXTBOOKS = `${http}/author/next_books/get/`;
export const GET_AUTHOR_NEXTBLOGS = `${http}/author/next_blogs/get/`;
export const GET_USER_CATEGORIES = `${http}/user/user_categories`;
// export const GET_CATEGORIES = `${http}/categories`;
export const ADD_CATEGORY = `${httpPost}/user/add_category`;
export const DELETE_CATEGORY = `${httpPost}/user/delete_category`;
export const ALL_CATEGORY = `${http}/all_category`;
export const UPLOAD_IMAGE = `${httpImage}/upload_image`
export const UPDATE_IMAGE = `${httpImage}/update_image`

export const URL_UPDATE_IMAGE_BOOK = `${httpPost}/book/update_image`
export const URL_UPDATE_IMAGE_BLOG = `${httpPost}/blog/update_image`
export const URL_UPDATE_IMAGE_NODE_BOOK = `${httpPost}/booknode/update_image`
export const URL_UPDATE_IMAGE_NODE_BLOG = `${httpPost}/blognode/update_image`
