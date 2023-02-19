import { CREATE_NEW_BOOK, UPLOAD_IMAGE } from 'lily-query';
import { postRequest, uploadImage } from "../index";

export const createBook = (props: any) => {
    const { ctxProvider, navigate } = props
    const { vueCtx, dispatch } = ctxProvider
    const formData = { 
        titleLabel: 'Book Name/Title',
        bodyLabel: 'Book Body/Description',
        titleValue: '',
        bodyValue: '',
        method: 'create', 
        identity: 101 
    }

    const createBookSubmitData = (f: any, i: any) => {
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
        uploadImage(UPLOAD_IMAGE, preFormData)
        .then((postImgRes: any) => {
            const bookSubmitData = createBookSubmitData(preFormData, postImgRes.data);
            return postRequest(CREATE_NEW_BOOK, bookSubmitData)
        })
        .then((postCreateData: any) => {
            navigate(`/book/edit/${postCreateData.data.uniqueId}`)
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