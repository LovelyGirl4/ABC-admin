import { addLocaleData } from 'react-intl';
import zh_CN from './locale/zh_CN';
import en_US from './locale/en_US';
import { message } from 'antd';
import { getUploadConfig, uploadFiles } from './api';

// 从缓存中取到token，login时已经将token存到缓存
export const getToken = () => {
    let token = window.localStorage.getItem('token');
    if (token) {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        if (+new Date() > exp * 1000) {
            window.localStorage.removeItem('token');
            return null;
        }
        return token;
    }
    return null;
};

export const getDefaultLocale = () => {
    const language = window.navigator.language || window.navigator.browserLanguage || 'zh';
    if (/^(zh|zh-CN)$/i.test(language)) {
        addLocaleData(zh_CN.data);
        return zh_CN;
    } else {
        addLocaleData(en_US.data);
        return en_US;
    }
};

export const createFormReducer = defaultState => {
    return (state = defaultState, action) => {
        const { type } = action;
        switch (type) {
            case 'FORM_ITEM_CHANGE':
                return {
                    ...state,
                    [action.formName]: {
                        ...state[action.formName],
                        [action.fieldName]: action.value,
                    },
                };
            case 'FORM_COMPLETE':
                return {
                    ...state,
                    [action.formName]: {
                        ...state[action.formName],
                        ...action.items,
                    },
                };
            case 'FORM_RESET':
                return {
                    ...state,
                    [action.formName]: { ...defaultState[action.formName] },
                };
            case 'CREATE_USER_SUCCESS':
                return {
                    ...state,
                    addUser: {
                        avator: '',
                        email: '',
                        password: '',
                        name: '',
                        mobile: '',
                        role: 'webmaster',
                        note: '',
                        is_active: true,
                    },
                };
            default:
                return { ...state };
        }
    };
};

export const createFormActionWithFormName = formName => {
    return e => ({
        type: 'FORM_ITEM_CHANGE',
        formName,
        fieldName: e.target.name,
        value: e.target.value,
    });
};

export const createCompleteFormActionWithFormName = formName => {
    return items => ({
        type: 'FORM_COMPLETE',
        formName,
        items,
    });
};

export const createResetFormActionWithFormName = formName => {
    return () => ({ type: 'FORM_RESET', formName });
};

export const createAsyncUIReducer = items => {
    const defaultState = {};
    for (let state in items) {
        if (items.hasOwnProperty(state)) {
            defaultState[state] = false;
        }
    }
    return (state = defaultState, action) => {
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                switch (action.type) {
                    case items[key]:
                        return { ...state, [key]: true };
                    case items[key] + '_SUCCESS':
                        return { ...state, [key]: false };
                    case items[key] + '_ERROR':
                        return { ...state, [key]: false };
                    default:
                        break;
                }
            }
        }
        return { ...state };
    };
};

// 修改Object属性名
export const transformKey = (obj, oldKey, newKey) => {
    let newObj = {};
    Object.keys(obj).forEach((key, index) => {
        if (key === oldKey) {
            newObj[newKey] = obj[key];
        } else {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};
// guid:生成一串随机数，防止图片、附件上传后地址一致
export const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

// 图片、附件上传
// 将图片转为blob类型
export const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
};
// regex type=image——判断上传类型是不是图片
export const rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
// 读取，压缩图片，TODO readFile(file, ratio, fileSizeLimit, quality)
const readFile = (file) => {
    let fileSize = file.size;
    let fileType = file.type;
    return new Promise((resolve, reject) => {
        if (fileSize <= 209715) {
            resolve(file);
        } else if (rFilter.test(fileType)) {
            let reader = new FileReader();
            reader.onload = (e) => {
                let myImage = new Image();
                myImage.src = e.target.result;
                // 获取图片真实的高度和宽度必须在onload里面
                myImage.onload = () => {
                    var width = myImage.width;
                    var height = myImage.height;
                    var ratio;
                    if ((ratio = width * height / 1000000) > 1) {
                        ratio = Math.sqrt(ratio);
                        width /= ratio;
                        height /= ratio;
                    } else {
                        ratio = 1;
                    }
                    let canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(myImage, 0, 0, width, height);
                    // toBlob——mac自带浏览器Safari不支持
                    // toBlob(function(){}, type, quality)
                    // canvas.toBlob(function(blob) {
                    //     resolve(blob);
                    // }, 'image/jpeg', 0.6);
                    const baseData = canvas.toDataURL('image/jpeg', 0.6);
                    const blobData = dataURLtoBlob(baseData);
                    resolve(blobData);
                };
            };
            reader.readAsDataURL(file);
        } else {
            resolve(file);
        }
    });
};
// 图片、附件上传
export const s3Upload = (awsInfo, picture, GUID) => {
    return readFile(picture).then(blob => {
        let formData = new FormData();
        formData.append('key', `${awsInfo.dir}/${GUID}${picture.name}`);
        formData.append('acl', 'public-read');
        formData.append('Content-Type', 'image/');
        formData.append('X-Amz-Credential', awsInfo.policy.conditions[4]['x-amz-credential']);
        formData.append('X-Amz-Algorithm', awsInfo.policy.conditions[5]['x-amz-algorithm']);
        formData.append('X-Amz-Date', awsInfo.policy.conditions[6]['x-amz-date']);
        formData.append('Policy', awsInfo.string_to_sign);
        formData.append('X-Amz-Signature', awsInfo.signature);
        formData.append('file', blob);
        // return formData;
        return uploadFiles(formData);
    });
};
// 老的——图片、附件上传——不压缩图片
// export const s3FormData = (awsInfo, file, GUID) => {
//     let formData = new FormData();
//     formData.append('key', `${awsInfo.dir}/${GUID}${file.name}`);
//     formData.append('acl', 'public-read');
//     formData.append('Content-Type', 'image/');
//     formData.append('X-Amz-Credential', awsInfo.policy.conditions[4]['x-amz-credential']);
//     formData.append('X-Amz-Algorithm', awsInfo.policy.conditions[5]['x-amz-algorithm']);
//     formData.append('X-Amz-Date', awsInfo.policy.conditions[6]['x-amz-date']);
//     formData.append('Policy', awsInfo.string_to_sign);
//     formData.append('X-Amz-Signature', awsInfo.signature);
//     formData.append('file', file);
//     return uploadFiles(formData);
// };

export const getBase64Image = (img) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(img);
    });
};


const base_url = 'http://gw-s3-dev.s3.amazonaws.com/';
export const baseURL = (url) => {
    let temp;
    if (url) {
        if (url.indexOf('base64') >= 0 || url.indexOf('http') >= 0) {
            temp = url;
        } else {
            temp = base_url + url;
        }
    }
    return temp;
};
