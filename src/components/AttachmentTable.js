import React from 'react';
import { useState, useEffect } from "react";
import './AttachmentTable.css';
import { Table, Space } from 'antd';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function AttachmentTable(props) {
    const [data, setData] = useState([]);
    const [loadling, setLoadling] = useState(true);


    useEffect(() => {
        setLoadling(true);
        ipcRenderer.send("get-file-list", ["local", "attachment"]);
    }, [props.updateToggle])

    useEffect(() => {
        ipcRenderer.on("file-list", (event, arg) => {
            let newones = [];
            arg.forEach(item => {
                newones.push({key: item, fileName: item});
            });
            setData(newones);
            setLoadling(false);
        });
        return (() => {
            ipcRenderer.removeAllListeners("file-list");
        });
    }, []);
    

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
                    <a onClick={() => props.onExamineClick(record)}>查看</a>
                    <a onClick={() => props.onDeleteClick(record)}>删除</a>
                </Space>
            ),
        },
    ];
    return (
        <div className="mp-c-atttbl">
            <Table className="mp-c-atttbl-table"
                columns={columns}
                rowKey={record => record.key}
                dataSource={data}
                pagination={false}
                // onChange={props.onTableChange}
                sortDirections={['ascend', 'descend', 'ascend']}
                showSorterTooltip={false}
                loading={loadling}
            />
        </div>
    );
}
