import React from 'react';
import { useState, useEffect } from "react";
import './AttachmentDrawer.css';
import { Table, Space, Drawer, Button } from 'antd';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function AttachmentDrawer(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        ipcRenderer.send("get-file-list", ["local", "attachment"]);
    }, [props.updateToggle]);

    useEffect(() => {
        ipcRenderer.on("file-list", (event, arg) => {
            let newones = [];
            arg.forEach(item => {
                newones.push({key: item, fileName: item});
            });
            setData(newones);
            setLoading(false);
        });
        return (() => {
            ipcRenderer.removeAllListeners("file-list");
        });
    }, []);

    const onBrowserDisplayClick = (e) => {
        ipcRenderer.send("show-item-in-folder", ["local", "attachment"]);
        ipcRenderer.send("show-item-in-folder", ["local", "attachment", "att1.pdf"]);
    }

    const onRefreshClick = (e) => {
        setLoading(true);
        ipcRenderer.send("get-file-list", ["local", "attachment"]);
    }

    const onExamineClick = (record) => {
        ipcRenderer.send("open-file", ["local", "attachment", record.fileName]);
    }

    const onDeleteClick = (record) => {

    }
    

    const columns = [
        {
            title: '附件名称',
            dataIndex: 'fileName',
            key: 'fileName',
            sorter: (a, b) => a.fileName.localeCompare(b.fileName),
            defaultSortOrder: "ascend",
            // width: '20%',
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => onExamineClick(record)}>查看</a>
                    {/* <a onClick={() => onDeleteClick(record)}>删除</a> */}
                </Space>
            ),
        },
    ];
    
    return (
        <div className="mp-c-attdrw">
            <Drawer
                title="附件列表"
                placement="right"
                onClose={props.onClose}
                visible={props.visible}
                width="500"
            >
                <div style={{ marginBottom: 16 }}>
                    <Button onClick={onBrowserDisplayClick} loading={loading}>
                        在文件夹显示
                    </Button>

                    <Button onClick={onRefreshClick} loading={loading} style={{ marginLeft: 8 }}>
                        刷新
                    </Button>
                </div>
                <Table className="mp-c-attdrw-table"
                    columns={columns}
                    rowKey={record => record.key}
                    dataSource={data}
                    // pagination={false}
                    // onChange={props.onTableChange}
                    sortDirections={['ascend', 'descend', 'ascend']}
                    showSorterTooltip={false}
                    loading={loading}
                />
            </Drawer>
        </div>
    );
}

