import { Page, Section } from "lily-types";
import { 
    DELETE_BOOK, DELETE_BLOG_NODE, DELETE_AND_UPDATE_BOOK_NODE, 
    DELETE_AND_UPDATE_BLOG_NODE, DELETE_BLOG_URL, DELETE_BOOK_NODE 
} from "lily-query";
import { CreateTopBotUniqueIds } from "../common/update";
import { getChildIds } from "../common";

class DeleteDataHandler {
    props: any;
    constructor(props: any) {
        this.props = props;
    }

    getData() {
        const { ctxProvider, node } = this.props;
		const { bookCtxNodes, api } = ctxProvider;
		const { identity } = node;
		if (!bookCtxNodes || !api) return { updateData: [], deleteData: [] };

		const x = new CreateTopBotUniqueIds(this.props);
		let updateData: any = [];
		let deleteData: any = [];
		if (identity === 104) {
			updateData = x.page();
			deleteData = [bookCtxNodes.uniqueId, ...getChildIds(bookCtxNodes as Page)];
		}
		if (identity === 105) {
			updateData = x.section();
			deleteData = [node.uniqueId, ...getChildIds(bookCtxNodes as Section)];
		}
		if (identity === 106) {
            updateData = x.subSection();
			deleteData = [node.uniqueId];
		}

        return {
            updateData,
            deleteData,
        }
    }
}

class UrlHandler {
    props: any;
    constructor(props: any) {
        this.props = props;
    }
    
    private setBookUrl() {
        const { node, category, updateData } = this.props;
        if (node.identity === 101) {
            this.props.url = DELETE_BOOK + node.uniqueId + "/" + category;
        }
        if (node.identity !== 101) {
            this.props.url = updateData && updateData.botUniqueId === null ? DELETE_BOOK_NODE : DELETE_AND_UPDATE_BOOK_NODE;
        }

    }

    private setBlogUrl() {
        const { node, category, updateData } = this.props;
        if (node.identity === 101) {
            this.props.url = DELETE_BLOG_URL + node.uniqueId + "/" + category;
        }
        if (node.identity !== 101) {
            if (!updateData) {
                this.props.url = DELETE_BLOG_NODE;
            }
            if (updateData && updateData.botUniqueId) {
                this.props.url = DELETE_AND_UPDATE_BLOG_NODE;
            }
        }
    }

    setUrl() {
        const { vueCtx } = this.props.ctxProvider;
        if (vueCtx.docType === 'book') {
            this.setBookUrl();
        }

        if (vueCtx.docType === 'blog') {
            this.setBlogUrl();
        }
    }
}

export class DeleteConstructor {
    props: any;
    deleteDataHandler: DeleteDataHandler;
    url: UrlHandler;

    constructor(props: any) {
        this.props = props;
        this.deleteDataHandler = new DeleteDataHandler(props);
        this.url = new UrlHandler(props);
        this.props.deleteData = [];
        this.props.updateData = [];
    }
    set(key: string, value: any) {
        this.props[key] = value;
    }
    get(key: string) {
        return this.props[key];
    }

    getBlogModalTitle(identity: number) {
        switch (identity) {
            case 101:
                return 'Are you sure you want to delete Blog?';
            case 104:
                return 'Are you sure you want to delete node?';
            default:
                break;
        }
    }

    getBookModalTitle(identity: number) {
        switch (identity) {
            case 101:
                return 'Are you sure you want to Delete Book?';
            case 104:
                return 'Are you sure you want to Delete Page? Deleting a page will also delete its sections and sub-sections.';
            case 105:
                return 'Are you sure you want to Delete Section? Deleting a section will also delete its sub-sections.';
            case 106:
                return 'Are you sure you want to Delete Sub-Section?';
            default:
                break;
        }
    }

    setModalTitle() {
        const { node, ctxProvider } = this.props;
        const { vueCtx } = ctxProvider;
        if (vueCtx.docType === 'book') {
            this.props.modalTitle = this.getBookModalTitle(node.identity);
        }
        if (vueCtx.docType === 'blog') {
            this.props.modalTitle = this.getBlogModalTitle(node.identity);
        }
    }

    // deleteBlogNode() {
	// 	const { ctxProvider } = this.props;
    //     const { context } = ctxProvider;
    //     const metadata = context[0].metadata;
    //     if (!metadata) return;
    //     const parsedMetadata = JSON.parse(metadata);
    //     const category = parsedMetadata.category;
    //     if (!category) return;
    // }

    init() {
        const { node, ctxProvider } = this.props;
        const { context, api, vueCtx, contextId } = ctxProvider;
        this.props.deleteData = [];
        this.props.updateData = [];
        if (node.identity === 101) {
            const metadata = context[contextId].metadata;
            if (!metadata) return;
            const parsedMetadata = JSON.parse(metadata);
            const category = parsedMetadata.category;
            if (!category) return;
            this.props.category = category;
        }
        if (node.identity !== 101) {
            if (vueCtx.docType === 'book') {
                const { updateData, deleteData } = this.deleteDataHandler.getData();
                if (updateData) {
                    this.props.updateData = updateData;
                }
                if (deleteData) {
                    this.props.deleteData = deleteData;
                    this.props.modalViewItems = api.filter((d: any) => deleteData.includes(d.uniqueId));
                }
            }
            if (vueCtx.docType === 'blog') {
                this.props.deleteData = [node.uniqueId];
			    this.props.updateData = TopBotId(context, node);
                this.props.modalViewItems = [];
            }
        }
        this.setModalTitle()
        this.url.setUrl();
    }
}


const TopBotId = (context: any[], node: any) => {
	let topUniqueId = null;
	let botUniqueId = null;

	topUniqueId = context[0].uniqueId;

	for (let i=0; i < context.length; i++) {
		if (context[i].uniqueId === node.uniqueId) {
			if (context[i + 1]) {
				botUniqueId = context[i + 1].uniqueId;
			}
			break;
		}
		topUniqueId = context[i].uniqueId;
	}

	if (!botUniqueId) return null;
	return { topUniqueId, botUniqueId };
}