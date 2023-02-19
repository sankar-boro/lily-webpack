const groupSiblingsForParent = (parent: any, child: any) => {
    let pId = parent.uniqueId;
    const siblings: any[] = [];
    let c = 0;

    const removeIds: any[] = [];
    const newSiblings: any[] = [];

    while (c !== child.length) {
        // eslint-disable-next-line no-loop-func
        child.forEach((ss: any) => {
            if (ss.parentId === pId) {
                siblings.push(ss);
                pId = ss.uniqueId;
                removeIds.push(ss.uniqueId);
            }
        });
        c++;
    }

    child.forEach((ss: any) => {
        if (!removeIds.includes(ss.uniqueId)) {
            newSiblings.push(ss);
        }
    });
    const newParent = parent;
    newParent.child = siblings;
    return { newParent, newSiblings, removeIds };
}

const groupSectionsForPage = groupSiblingsForParent;
const groupSubSectionsForSection = groupSiblingsForParent;

function reOrderFrontPage(
    frontPage: any,
    samples: any
) {
    let { allSubSectionGroups } = samples;
    const { allSectionGroups } = samples;
    const frontPages = groupSectionsForPage(frontPage, allSectionGroups);

    if (frontPages.newParent.child.length === 0) {
        return frontPages;
    }

    if (frontPages.newParent.child.length > 0) {
        const newSubSections = frontPages.newParent.child.map(
            (section: any) => {
                const allSubSections = groupSubSectionsForSection(
                    section,
                    allSubSectionGroups
                );
                allSubSectionGroups = allSubSections.newSiblings;
                return allSubSections.newParent;
            }
        );
        frontPages.newParent.child = newSubSections;
        return frontPages;
    }
    return frontPages;
}

function groupWithIdentity(apiData: any) {
    const identityGroups: any = {
        101: [],
        102: [],
        103: [],
        104: [],
        105: [],
        106: [],
    };

    apiData.forEach((node: any) => {
        if (identityGroups[node.identity]) {
            identityGroups[node.identity].push(node);
        }
    });
    return identityGroups;
}

const groupChapters = (parentId: string, chapters: any) => {
    let currentParentId = parentId;
    const orders: any = [];
    while (orders.length !== chapters.length) {
        // eslint-disable-next-line no-loop-func
        for (let i=0; i < chapters.length; i++) {
            const thisChapter = chapters[i];
            if (currentParentId === thisChapter.parentId) {
                orders.push(thisChapter);
                currentParentId = thisChapter.uniqueId;
                break;
            }
        }
    }
    return orders;
};

export const sortAll = (rawApi: any, removeIds: any[] = []) => {
    let data: any = rawApi;
    if (removeIds.length > 0) {
        data = rawApi.filter((d: any) => {
            if (removeIds.includes(d.uniqueId)) {
                return false;
            }
            return true;
        });
    }

    const allGroups = groupWithIdentity(data);
    const samples = {
        allSectionGroups: allGroups[105],
        allSubSectionGroups: allGroups[106]
    }

    const allFrontPages = { 101: allGroups[101], 102: allGroups[102], 103: allGroups[103], 104: allGroups[104] };
    allFrontPages[104] = groupChapters(allGroups[101][0].uniqueId, allFrontPages[104]);
    
    const chapters: any = [];
    Object.values(allFrontPages)
    .forEach((frontPageObjectValue) => {
        frontPageObjectValue.forEach((frontPage: any) => {
            const { newParent, newSiblings } = reOrderFrontPage(frontPage, samples);
            samples.allSectionGroups = newSiblings;
            chapters.push(newParent);
        })
    });
    return chapters;
};

export const sortPage = (rawApi: any, pageId: string) => {
    const data: any = rawApi;

    const allGroups = groupWithIdentity(data);
    const samples = {
        allSectionGroups: allGroups[105],
        allSubSectionGroups: allGroups[106]
    }

    // const allFrontPages = { 104: allGroups[104] };
    // allFrontPages[104] = groupChapters(pageId, allFrontPages[104]);
    const frontPage = { uniqueId: pageId, pageId };
    const { newParent } = reOrderFrontPage(frontPage, samples);
    return { ...rawApi[0], ...newParent };
};

export const setActivePageFn = (props: {
    context: any,
    compareId: any,
}) => {
    const { context, compareId } = props;
    let bookCtxNodes = null;
    const found = false;
    context.forEach((page: any) => {
        if (!found && page.uniqueId === compareId) {
            bookCtxNodes = page;
        }
        page.child.forEach((section: any) => {
            if (!found && section.uniqueId === compareId) {
                bookCtxNodes = section;
            }
        })
    });
    
    return bookCtxNodes;
}