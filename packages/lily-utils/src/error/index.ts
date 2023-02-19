export const LoginErrorMsgHandler = (err: any) => {
    console.log(err.response);
    if (err) {
        if (err.message === "USER_NOT_FOUND") {
            return "User not found.";
        }
        if (err.message === "WRONG_PASSWORD") {
            return "Wrong password."
        }
        if (err.response && err.response.data && err.response.data.message) {
            if (err.response.data.message === "invalid_email") {
                return "Invalid email.";
            }
            if (err.response.data.message === "WRONG_PASSWORD") {
                return "Invalid password.";
            }
            if (err.response.data.message === "invalid_fname") {
                return "Invalid Firstname.";
            }
            if (err.response.data.message === "invalid_lname") {
                return "Invalid Lastname.";
            }
        }
    }
    return 'Oops! Something went wrong.'
}

export const ImgUploadErrorMsgHandler = (err: any) => {
    const errTitle = 'Error.'
    if (err) {
        if (err.message === "USER_NOT_FOUND") {
            return { title: errTitle, value: "User not found." };
        }
        if (err.message === "WRONG_PASSWORD") {
            return { title: errTitle, value: "Wrong password." };
        }
        if (err.response && err.response.data && err.response.data.message) {
            if (err.response.data.message === "INVALID_EXT") {
                return { title: errTitle, value: "Lily only supports JPG/JPEG, PNG format." };
            }
        }
    }
    return { title: errTitle, value: 'Oops! Something went wrong.' }
}

export const PostSuccessMsgHandler = (res: any) => {
    const {} = res;
    return {
        created: {
            title: 'Success',
            value: 'Created'
        },
        updated: {
            title: 'Success',
            value: 'Updated'
        }
    }
}

export const PostErrMsgHandler = (err: any) => {
    console.log(err)
    const errTitle = 'Error.'
    return { title: errTitle, value: 'Oops! Something went wrong.' }
}