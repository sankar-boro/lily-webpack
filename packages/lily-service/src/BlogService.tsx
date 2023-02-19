import { GET_BLOG_FROM_ID } from "lily-query";
import { sortAll, getRequest } from 'lily-utils';

class BlogConstructor {
    apis: any = null;
    constructor() {
        this.apis = [];
    }
}

class BlogNodesParser {
    data: any;
    constructor(data: any) {
        this.data = data;
    }

    parse(fetchData: any) {
        const { data } = this;
        const { page, nodes } = data;
        fetchData.getNextPageId = page;
        fetchData.api = nodes;
        if (nodes.length > 0) {
            const blogNodes = sortAll(nodes, []);
            const firstPage = blogNodes[0];
            const childNodes = blogNodes.splice(1);
            fetchData.authorId = firstPage && firstPage.authorId;
            fetchData.blogContext = {
                mainNode: firstPage,
                category: firstPage,
                childNodes,
            };
            fetchData.contextData = JSON.parse(firstPage.metadata);
            fetchData.fetchedContext = null;
        }
        this.data = null;
    }
}

class BlogHandler extends BlogConstructor {

    fetchBlog(contextId: string){
        const url = `${GET_BLOG_FROM_ID}${contextId}`
        const data = { url };
        return new Promise(async (resolve, reject) => {
            const onResolve = (r: any) => { 
                this.apis.push(new BlogNodesParser(r.data)); 
                resolve(this);
            }
            const onReject = (e: any) => {
                console.log(e)
                reject(this);
            }
            getRequest(data, onResolve, onReject);
        });
    }

    clear() {
        this.apis = [];
    }
}

export { BlogHandler } ;