import { QueryHandler } from 'lily-query';
import { createBook } from "./book/createBook";
import { createBlog } from "./blog/createBlog";
export * from './book';

export * from './blog/createBlog';
export * from './blog/createNode';
export * from './blog/updateNode';
export * from './blog/delete';

export * from './error/index';
export * from './utils';
export * from './view';
export * from "./auth";
export * from "./category";
export * from "./time";

export * from "./common"

export type FormResponse = {
    title: string,
    body: string,
    category: string | null,
}

export class GetQuery {
    auth = false;
    setAuth(auth: any) {
        this.auth = auth;
        return this;
    }
    query(url: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            new QueryHandler(undefined)
            .setAuth(this.auth)
            .setUrl(url)
            .run()
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }
}

export class PostQuery {
    auth = false;
    setAuth(auth: any) {
        this.auth = auth;
        return this;
    }
    query(url: string, data: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            new QueryHandler(undefined)
            .setAuth(true)
            .setUrl(url)
            .setMethod('post')
            .setFormData(data)
            .run()
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }
}

const createImageMetadata = (imageData: any) => {
    const { image: firstImage, userId } = imageData;
    const { image, resize } = firstImage;
    const { blob, name } = image;
    const { x, y, width, height } = resize;
    return {
        blob,
        name,
        metadata: {
            xAxis: x,
            yAxis: y,
            imgWidth: width,
            imgHeight: height,
            userId
        }
    }
}

const createImageUpdateMetadata = (imageData: any, oldImg: any) => {
    const { image: firstImage, userId } = imageData;
    const { image, resize } = firstImage;
    const { blob, name } = image;
    const { imgExt, imgName } = oldImg;
    const { x, y, width, height } = resize;
    return {
        blob,
        name,
        metadata: {
            xAxis: x,
            yAxis: y,
            imgWidth: width,
            imgHeight: height,
            userId,
            imgExt,
            imgName,
        }
    }
}

export const uploadImage = (url: any, rawImg: any): Promise<any> => {
    if (!rawImg.image) {
        return new Promise((resolve) => {
            resolve({data:null});
        })
    }
    const { blob, name, metadata } = createImageMetadata(rawImg);
    // Create an object of formData
    const imageData = new FormData();
    // Update the formData object
    imageData.append(
        "metadata",
        JSON.stringify(metadata)
    );
    imageData.append(
        "image",
        blob,
        name
    );
    return new PostQuery().query(url, imageData);
}

export const updateImage = (url: any, rawImg: any, oldImg: any): Promise<any> => {
    if (!rawImg.image) {
        return new Promise((resolve) => {
            resolve({data:null});
        })
    }
    const { blob, name, metadata } = createImageUpdateMetadata(rawImg, oldImg);
    // Create an object of formData
    const imageData = new FormData();
    // Update the formData object
    imageData.append(
        "metadata",
        JSON.stringify(metadata)
    );
    imageData.append(
        "image",
        blob,
        name
    );
    return new PostQuery().query(url, imageData);
}

export const POST_SUBMIT = (url: string, data: any) => {
    return new Promise((resolve, reject) => {
        new PostQuery()
        .query(url, data)
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            reject(err);
        });
    })
}

export const getRequest = (props: any, resolve: any, reject: any | undefined) => {
    const { url } = props;
    new GetQuery()
    .query(url)
    .then((res) => {
        resolve(res)
    })
    .catch((err) => {
        reject(err);
    });
}

export const getRequestAuth = (props: any, resolve: any, reject: any | undefined) => {
    const { url } = props;
    new GetQuery()
    .setAuth(true)
    .query(url)
    .then((res) => {
        resolve(res)
    })
    .catch((err) => {
        reject(err);
    });
}

export const postRequest = POST_SUBMIT;

export const LOG = false;

export const createNew = (props: any) => {
    const { docType } = props.ctxProvider.vueCtx;
    if (docType === 'book') {
        createBook(props);
    }
    if (docType === 'blog') {
        createBlog(props);
    }
}