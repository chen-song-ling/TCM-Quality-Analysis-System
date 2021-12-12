import React from 'react';
import { useState, useEffect } from "react";
import './AttachmentDrawerPlus.css';
import { Table, Space, Drawer, Button, Popconfirm, Progress, notification, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { baseStaticUrl } from '../util/const';

import { apiGetTask, apiGetProject, apiAddTaskAttachment, apiDeleteTaskAttachment, apiAddProjectAttachment, apiDeleteProjectAttachment } from '../util/api';
// import { file } from '_fs-jetpack@4.2.0@fs-jetpack';


const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

// const baseStaticUrl = "http://10.249.43.41:8080/static/";

export default function AttachmentDrawerPlus(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [networdArgs, setNetwordArgs] = useState(null);
    // const [file, setFile] = useState(null);

    const refreshTable = () => {
        if (props.networdArgs.type === "task") {
            apiGetTask(props.networdArgs.accessToken, props.networdArgs.id).then((res) => {
                if (res.data.attachments !== null) {
                    setData(res.data.attachments);
                    // console.log(res.data.attachments);
                }
            }).catch((err) => {
                console.log(err);
            });

        } else if (props.networdArgs.type === "project") {
            apiGetProject(props.networdArgs.accessToken, props.networdArgs.id).then((res) => {
                if (res.data.attachments !== null) {
                    setData(res.data.attachments);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    useEffect(() => {
        setNetwordArgs(props.networdArgs);
        refreshTable();
    }, [props.updateToggle]);

    useEffect(() => {
        // setNetwordArgs(props.networdArgs);
        // refreshTable();

        ipcRenderer.on("download-progress", (event, info) => {
            // console.log(info);
            // let downloadProgress = 100 * info.percent;
            // if (downloadProgress >= 100) {
            //     downloadProgress = 99;
            // }

            // let newData = [... data];
            // for (let i = 0; i < newData.length; i++) {
            //     if (newData[i].uuid === info.uuid) {
            //         if (newData[i].downloadProgress !== undefined && newData[i].downloadProgress === 100) {

            //         } else {
            //             newData[i] = {
            //                 ...newData[i],
            //                 downloadProgress: downloadProgress,
            //             };
            //         }
            //     }
            // }
            // setData(newData);

        });

        ipcRenderer.on("download-complete", (event, info) => {
            // console.log(info);

            // console.log(data);
            // let newData = [... data];
            // for (let i = 0; i < newData.length; i++) {
            //     if (newData[i].uuid === info) {
            //         newData[i] = {
            //             ...newData[i],
            //             downloadProgress: 100,
            //         };
            //     }
            // }
            // setData(newData);
            // console.log(newData);

            notification.open({
                message: "下载完成",
                description: info.filename + "下载完成。",
            });

        });

        return (() => {
            ipcRenderer.removeAllListeners("download-progress");
            ipcRenderer.removeAllListeners("download-complete");
        });

    }, []);

    const onExamineClick = (record) => {
        ipcRenderer.send("view-file-online", record.save_path);
    }

    const onDeleteClick = (record) => {

        if (props.networdArgs.type === "task") {
            apiDeleteTaskAttachment(props.networdArgs.accessToken, props.networdArgs.id, record.uuid).then((res) => {
                refreshTable();
    
            }).catch((err) => {
                console.log(err);
            });

        } else if (props.networdArgs.type === "project") {
            apiDeleteProjectAttachment(props.networdArgs.accessToken, props.networdArgs.id, record.uuid).then((res) => {
                refreshTable();
    
            }).catch((err) => {
                console.log(err);
            });

        }
        
    }

    const onDownloadClick_discarded = (record) => {

        let savePath = ipcRenderer.sendSync("sync-open-save-dialog", {defaultFileName: record.filename});
        console.log(savePath);

        if (savePath !== undefined) {

            ipcRenderer.send("download", {
                url: baseStaticUrl + record.save_path,
                properties: {
                    saveAs: true,
                    // directory: savePath
                },
                uuid: record.uuid,
            });

            // let newData = [... data];
            // for (let i = 0; i < newData.length; i++) {
            //     if (newData[i].uuid === record.uuid) {
            //         newData[i] = {
            //             ...newData[i],
            //             downloadProgress: 0,
            //         };
            //     }
            // }
            // setData(newData);
        }
        
    }

    const onDownloadClick = (record) => {
        ipcRenderer.send("download", {
            url: baseStaticUrl + record.save_path,
            properties: {
                saveAs: true,
                filename: record.filename,
            },
            uuid: record.uuid,
            filename: record.filename,
        });
    }

    const renderDownloadCell = (record) => {
        if (record.downloadProgress === undefined || record.downloadProgress === -1) {
            return (<a onClick={() => onDownloadClick(record)}>下载</a>);
        } else {
            return (<Progress percent={record.downloadProgress} size="small" />);
        }
    }

    // BEGIN -- Upload

    const onUploadClick = (e) => {
        let ele = document.getElementById("the-ghost-uploadfile");
        ele.click();
    };

    const onFileChange = (e) => {
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }

        let formData = new FormData();
        formData.append('file', files[0]);

        if (props.networdArgs.type === "task") {
            apiAddTaskAttachment(props.networdArgs.accessToken, props.networdArgs.id, formData).then((res) => {
                console.log(res);
                refreshTable();

            }).catch((err) => {
                console.log(err);
            });

        } else if (props.networdArgs.type === "project") {
            apiAddProjectAttachment(props.networdArgs.accessToken, props.networdArgs.id, formData).then((res) => {
                console.log(res);
                refreshTable();

            }).catch((err) => {
                console.log(err);
            });

        }

    }

    // END -- Upload

    const columns = [
        {
            title: '附件名称',
            dataIndex: 'filename',
            key: 'filename',
            sorter: (a, b) => a.filename.localeCompare(b.filename),
            defaultSortOrder: "ascend",
            // width: '20%',
        },
        {
            title: '管理',
            dataIndex: '',
            key: 'manage',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => onExamineClick(record)}>查看</a>
                    <Popconfirm 
                        title="您确定要删除吗？" 
                        okText="是" 
                        cancelText="取消"  
                        onConfirm={() => onDeleteClick(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
        {
            title: '下载',
            dataIndex: '',
            key: 'download',
            render: (text, record) => (
                <Space size="middle">
                    {renderDownloadCell(record)}
                </Space>
            ),
            // width: '40%',
        },
    ];


    return (
        <div className= "mp-c-newad">
            <Drawer
                title="附件列表"
                placement="right"
                onClose={props.onClose}
                visible={props.visible}
                width="500"
            >
                <div style={{ marginBottom: 16 }}>
                    <Button onClick={onUploadClick} icon={<UploadOutlined />}>上传</Button>
                </div>

                <Table className="mp-c-newad-table"
                    columns={columns}
                    rowKey={record => record.uuid}
                    dataSource={data}
                    // pagination={false}
                    // onChange={props.onTableChange}
                    sortDirections={['ascend', 'descend', 'ascend']}
                    showSorterTooltip={false}
                    loading={loading}
                />
            </Drawer>

            <input type="file" id="the-ghost-uploadfile" style={{display: "none"}} onChange={onFileChange} /> 
        </div>
    );
}
