import { CREATE_NEW_BLOG, UPLOAD_IMAGE } from 'lily-query';
import { postRequest, uploadImage } from "../index";

export const createBlog = (props: any) => {
    const { ctxProvider, navigate } = props
    const { vueCtx, dispatch } = ctxProvider
    const formData = { 
        titleLabel: 'Blog Name/Title',
        bodyLabel: 'Blog Body/Description',
        titleValue: '',
        bodyValue: '',
        method: 'create', 
        identity: 101 
    }

    const createBlogSubmitData = (f: any, i: any) => {
        const { title, body, metadata, category } = f;
        return {
            title,
            body,
            metadata,
            category,
            image_url: i ? JSON.stringify(i) : null,
        }
    }

    const onCallBack = (preFormData: any) => {
        console.log('preFormData', preFormData);
        uploadImage(UPLOAD_IMAGE, preFormData)
        .then((postImgRes: any) => {
            const blogSubmitData = createBlogSubmitData(preFormData, postImgRes.data);
            return postRequest(CREATE_NEW_BLOG, blogSubmitData)
        })
        .then((postCreateData: any) => {
            navigate(`/blog/edit/${postCreateData.data.uniqueId}`)
        })
        .catch((e: any) => {
            console.log(e);
        }) 
    }

    const onCancel = () => {
        navigate("/", { replace: true });
    }
    const vue = {
        data: formData,
        callback: onCallBack,
        cancel: onCancel,
        docType: vueCtx.docType,
        status: 'form'
    }
    dispatch({
        keys: ['vueCtx'],
        values: [vue]
    })
}
