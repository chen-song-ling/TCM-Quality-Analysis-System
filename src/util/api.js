import axios from 'axios';
import { baseUrl } from './const';
// const baseUrl = "http://lab2.tery.top:8080";
// const baseUrl = "http://10.249.43.41:8080";
const version = "v1";

export const apiLogin = (username, password) => {
    // console.log(baseUrl);
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/login/access-token`,
            data: {
                username: username,
                password: password,
            },
            transformRequest: [
                function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    ret = ret.substring(0, ret.lastIndexOf('&'));
                    return ret
                }
            ],
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
};

export const apiRegister = (name, username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (false) {
                reject(new Error("apiLogin"));
            } else {
                resolve({ code: 200 });
            }

        }, 100);
    });
}

export const apiAdminLogin = (password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (false) {
                reject(new Error("apiAdminLogin"));
            } else {
                resolve({ code: 200 });
            }

        }, 100);
    });
}

export const apiGetProjectList = (accessToken, skip, limit, sortField, sortOrder, searchKey) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects`,
            params: {
                skip: skip,
                limit: limit,
                sort_by_field: sortField,
                sort_order: sortOrder,
                search_key: searchKey,
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetProject = (accessToken, id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/${id}`,
            params: {
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetTaskList = (accessToken, projectId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks`,
            params: {
                project_id: projectId,
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetTask = (accessToken, taskId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

// {
//     "name": "性状1",
//     "type": "性状",
//     "sub_type": "",
//     "standard_desc": "",
//     "desc_manual": "",
//     "additional_fields": [],
//     "attachments": "",
//     "result": "",
//     "project_id": "1"
// }

export const apiAddTask = (accessToken, taskName, taskType, projectId) => {
    let jsonData = {
        name: taskName,
        type: taskType,
        sub_type: 0,
        standard_desc: "",
        desc_manual: "",
        additional_fields: [],
        attachments: "",
        result: "",
        // project_id: projectId,
    }
    console.log(taskType);
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks`,
            data: JSON.stringify(jsonData),
            params: {
                project_id: projectId,
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiUpdateTask = (accessToken, taskName, taskType, taskId, standardDesc, manualDesc, additionalFields, attachments, result, subType) => {
    let jsonData = {
        name: taskName,
        type: taskType,
        sub_type: subType,
        standard_desc: standardDesc,
        desc_manual: manualDesc,
        additional_fields: additionalFields,
        attachments: attachments,
        result: result,
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "put",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiDeleteTask = (accessToken, taskId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiRunCharacterTask = (accessToken, taskId, formData) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}/run`,
            data: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiRunMicroTask = (accessToken, taskId, formData) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}/run`,
            data: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetTaskReport = (accessToken, taskId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}/report`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetProjectReport = (accessToken, projectId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/${projectId}/report`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

// {
//     "name": "string",
//     "number": "string",
//     "standard": "string",
//     "note": "string",
//     "additional_fields": [
//       {
//         "field_name": "string",
//         "field_value": "string",
//         "is_included_in_report": false,
//         "is_required": true
//       }
//     ],
//     "attachments": "string"
// }

export const apiUpdateProject = (accessToken, projectName, sampleId, standard, note, additionalFields, attachments, projectId) => {
    // let additionalFields = [];
    // projectExtraInfo.forEach(item => {
    //     additionalFields.push({
    //         field_name: item.fieldName,
    //         field_value: item.fieldValue,
    //         is_included_in_report: true,
    //         is_required: true,
    //     })
    // });

    let jsonData = {
        name: projectName,
        number: sampleId,
        standard: standard,
        note: note,
        additional_fields: additionalFields,
        attachments: "",
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/${projectId}`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "put",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiAddProject = (accessToken, projectName, sampleId, standard, note) => {
    let jsonData = {
        name: projectName,
        number: sampleId,
        standard: standard,
        note: note,
        additional_fields: [],
        attachments: "",
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiDeleteProject = (accessToken, projectId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/${projectId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiAddTaskAttachment = (accessToken, taskId, formData) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}/attachments`,
            data: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiAddProjectAttachment = (accessToken, projrctId, formData) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/${projrctId}/attachments`,
            data: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiDeleteTaskAttachment = (accessToken, taskId, fileUuid) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}/attachments/${fileUuid}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiDeleteProjectAttachment = (accessToken, projrctId, fileUuid) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/${projrctId}/attachments/${fileUuid}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetUserMe = (accessToken) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/users/me`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiPutUserMe = (accessToken, fullName, email, password) => {
    let jsonData = {
        password: password,
        full_name: fullName,
        email: email,
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/users/me`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "put",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetAccountList = (accessToken, skip, limit, sortField, sortOrder, searchKey) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/users`,
            params: {
                skip: skip,
                limit: limit,
                // sort_by_field: sortField,
                // sort_order: sortOrder,
                // search_key: searchKey,
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiAddAccount = (accessToken, name, username, password, isadministrator) => {
    let jsonData = {
        full_name: name,
        email: username,
        password: password,
        is_active: true,
        is_superuser: isadministrator,
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/users`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiUpdateAccount = (accessToken, name, username, password, isadministrator, userId) => {
    let jsonData = {
        full_name: name,
        email: username,
        password: password,
        is_active: true,
        is_superuser: isadministrator,
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/users/${userId}`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "put",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiDeleteAccount = (accessToken, userId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/users/${userId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetFunctionList = (accessToken, skip, limit, sortField, sortOrder, searchKey) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions`,
            params: {
                skip: skip,
                limit: limit,
                sort_by_field: sortField,
                sort_order: sortOrder,
                // search_key: searchKey,
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiAddFunction = (accessToken, name, standard) => {
    let jsonData = {
        name: name,
        standard_desc: standard,
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiDeleteFunction = (accessToken, functionId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions/${functionId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiGetFunction = (accessToken, id) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions/${id}`,
            params: {
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "get",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiUpdateFunction = (accessToken, name, standard, functionId) => {

    let jsonData = {
        name: name,
        standard_desc: standard,
    }
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions/${functionId}`,
            data: JSON.stringify(jsonData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "put",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiUpdateVariable = (accessToken, variable, functionId) => {

    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions/${functionId}/variables`,
            data: JSON.stringify(variable),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json;'
            },
            method: "put",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiAddFunctionExcel = (accessToken, functionId, formData) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions/${functionId}/excel_file`,
            data: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data;'
            },
            method: "post",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export const apiDeleteFunctionExcel = (accessToken, functionId) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `${baseUrl}/api/${version}/functions/${functionId}/excel_file`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}