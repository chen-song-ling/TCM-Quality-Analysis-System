import axios from 'axios';
const baseUrl = "http://lab2.tery.top:8080";
const version = "v1";

export const apiLogin = (username, password) => {
    return new Promise((resolve,reject) => {
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
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if (false) {
                reject(new Error("apiLogin"));
            } else {
                resolve({code: 200});
            }
    
        }, 100);
    });
}

export const apiAdminLogin = (password) => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if (false) {
                reject(new Error("apiAdminLogin"));
            } else {
                resolve({code: 200});
            }
    
        }, 100);
    });
}

export const apiGetProjectList = (accessToken, skip, limit, sortField, sortOrder) => {
    return new Promise((resolve,reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects`,
            params: {
                skip: skip,
                limit: limit,
                sort_by_field: sortField,
                sort_order: sortOrder,
            },
            headers: { 
                'Authorization':`Bearer ${accessToken}`,
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
    return new Promise((resolve,reject) => {
        axios({
            url: `${baseUrl}/api/${version}/projects/${id}`,
            params: {  
            },
            headers: { 
                'Authorization':`Bearer ${accessToken}`,
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
    return new Promise((resolve,reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks`,
            params: {
                project_id: projectId,
            },
            headers: { 
                'Authorization':`Bearer ${accessToken}`,
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
        sub_type: "",
        standard_desc: "",
        desc_manual: "",
        additional_fields: [],
        attachments: "",
        result: "",
        project_id: projectId,
    }
    return new Promise((resolve,reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks`,
            data: JSON.stringify(jsonData),
            headers: { 
                'Authorization':`Bearer ${accessToken}`,
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

export const apiDeleteTask = (accessToken, taskId) => {
    return new Promise((resolve,reject) => {
        axios({
            url: `${baseUrl}/api/${version}/tasks/${taskId}`,
            headers: { 
                'Authorization':`Bearer ${accessToken}`,
            },
            method: "delete",
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}


// // projectId: 目标项目. 希望返回目标项目的所有任务
// export const apiGetTasksOverview = (username, projectId) => {
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//             if (false) {
//                 reject(new Error("apiGetProjectsOverview"));
//             } else {
//                 resolve(
//                     {
//                         code: 200,
//                         data: [
//                             {
//                                 key: '1',
//                                 id: '1',
//                                 taskName: '性状1',
//                                 addingTime: '2021-03-05',
//                                 taskType: '性状',
//                             },
//                             {
//                                 key: '2',
//                                 id: '2',
//                                 taskName: '性状2',
//                                 addingTime: '2021-03-06',
//                                 taskType: '性状',
//                             },
//                             {
//                                 key: '3',
//                                 id: '3',
//                                 taskName: '薄层1',
//                                 addingTime: '2021-03-07',
//                                 taskType: '薄层',
//                             },
//                         ]
//                     }
//                 );
//             }
    
//         }, 100);
//     });
// }