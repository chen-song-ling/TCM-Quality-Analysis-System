export const apiLogin = (username, password) => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if (false) {
                reject(new Error("apiLogin"));
            } else {
                resolve({code: 200});
            }
    
        }, 100);
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

// pageId: 页号, 表示第几页
// sortField: 指定排序字段
// sortOrder: 指定排序是升序号还是降序, ascend 或者 descend
// pageSize: 每页的条目数, 也决定了返回后每页的最大条目数
export const apiGetProjectsOverview = (username, pageId, sortField, sortOrder, pageSize) => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if (false) {
                reject(new Error("apiGetProjectsOverview"));
            } else {
                resolve(
                    {
                        code: 200,
                        total: 2,
                        data: [
                            {
                                key: '1',
                                id: '1',
                                name: '菊花',
                                addingTime: '2021-03-06',
                                sampleId: 'CZ20195363',
                                standard: '这是执行标准',
                                note: '这是备注',
                            },
                            {
                                key: '2',
                                id: '2',
                                name: '人参',
                                addingTime: '2021-02-06',
                                sampleId: 'CZ20187813',
                                standard: '这是执行标准',
                                note: '这是备注',
                            },
                        ]
                    }
                );
            }
    
        }, 100);
    });
}

// projectId: 目标项目. 希望返回目标项目的所有任务
export const apiGetTasksOverview = (username, projectId) => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if (false) {
                reject(new Error("apiGetProjectsOverview"));
            } else {
                resolve(
                    {
                        code: 200,
                        data: [
                            {
                                key: '1',
                                id: '1',
                                taskName: '性状1',
                                addingTime: '2021-03-05',
                                taskType: '性状',
                            },
                            {
                                key: '2',
                                id: '2',
                                taskName: '性状2',
                                addingTime: '2021-03-06',
                                taskType: '性状',
                            },
                            {
                                key: '3',
                                id: '3',
                                taskName: '薄层1',
                                addingTime: '2021-03-07',
                                taskType: '薄层',
                            },
                        ]
                    }
                );
            }
    
        }, 100);
    });
}