import { GET_BOOK_FROM_ID, GET_PAGENODES_FROM_ID, GET_BOOK_TITLES } from "lily-query";
import { sortAll, getRequest, sortPage } from 'lily-utils';

class BookConstructor {
    apis: any = null;
    constructor() {
        this.apis = [];
    }
}

class BookParser {
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
            const firstPage = nodes[0];
            fetchData.authorId = firstPage && firstPage.authorId;
            fetchData.bookContext = {
                mainNode: firstPage,
                childNodes: [],
                category: firstPage,
                node104UniqueId: firstPage.uniqueId,
            };
            fetchData.fetchedContext = { [firstPage.uniqueId]: firstPage };
            fetchData.contextData = JSON.parse(firstPage.metadata);
        }
        this.data = null;
    }
}

class TitleNodesParser {
    data: any;
    constructor(data: any) {
        this.data = data;
    }
    parse(fetchData: any) {
        const { data } = this;
        const { nodes } = data;
        const titles = sortAll(nodes, []);
        fetchData.titles = titles;
        titles.forEach((title: any) => {
            if (title.identity !== 101) {
                fetchData.fetchedContext[title.uniqueId] = null;
            }
        })
        fetchData.titles = titles;
        this.data = null;
    }
}

class PageNodesParser {
    data: any;
    inner: any;
    constructor(data: any, inner: any) {
        this.data = data;
        this.inner = inner;
    }
    parse(fetchData: any) {
        const { data, inner } = this;
        const { nodes } = data;
        const { pageId } = inner;
        const pageData = sortPage(nodes, pageId);
        const { child, ...PD } = pageData;
        fetchData.bookContext = {
            childNodes: child ? child : [],
            mainNode: PD,
            category: PD,
            node104UniqueId: PD.uniqueId,
        };
        fetchData.fetchedContext = pageData;
    }
}

class BookHandler extends BookConstructor {

    fetchBook(contextId: string) {
        const url = `${GET_BOOK_FROM_ID}${contextId}`;
        const data = { url };
        return new Promise(async (resolve, reject) => {
            const onResolve = (r: any) => { 
                this.apis.push(new BookParser(r.data)); 
                resolve(this);
            }
            const onReject = (e: any) => {
                console.log(e)
                reject(this);
            }
            getRequest(data, onResolve, onReject);
        });
    }

    fetchTitles(contextId: string) {
        const url = `${GET_BOOK_TITLES}${contextId}`
        const data = { url };
        return new Promise(async (resolve, reject) => {
            const onResolve = (r: any) => { 
                this.apis.push(new TitleNodesParser(r.data));
                resolve(this);
            }
            const onReject = (e: any) => {
                console.log(e)
                reject(this);
            }
            getRequest(data, onResolve, onReject);
        });
    }

    fetchPage(contextId: string, pageId: string) {
        const url = `${GET_PAGENODES_FROM_ID}${contextId}/${pageId}`;
        const data = { url };
        return new Promise(async (resolve, reject) => {
            const onResolve = (r: any) => {
                this.apis.push(new PageNodesParser(r.data, { contextId, pageId }));
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

export { BookHandler } ;
