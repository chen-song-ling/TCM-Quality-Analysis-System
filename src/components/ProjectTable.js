import React from 'react';
import './ProjectTable.css';
import { Popconfirm, Table, Space } from 'antd';

export default function ProjectTable(props) {
    const columns = [
        {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            sorter: (a, b) => a.taskName.localeCompare(b.taskName),
            // width: '20%',
        },
        {
            title: '添加时间',
            dataIndex: 'addingTime',
            key: 'addingTime',
            sorter: (a, b) => a.addingTime.localeCompare(b.addingTime),
            defaultSortOrder: "descend"
            // width: '20%',
        },
        {
            title: '任务类别',
            dataIndex: 'taskType',
            key: 'taskType',
            sorter: (a, b) => a.taskType.localeCompare(b.taskType),
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => props.onExamineClick(record)}>查看</a>
                    <a onClick={() => props.onEditClick(record)}>编辑</a>

                    <Popconfirm 
                        title="您确定要删除吗？" 
                        okText="是" 
                        cancelText="取消"  
                        onConfirm={() => props.onDeleteClick(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="mp-c-projecttable">
            <Table className="mp-project-table"
                    columns={columns}
                    rowKey={record => record.key}
                    dataSource={props.data}
                    pagination={false}
                    onChange={props.onTableChange}
                    sortDirections={['ascend', 'descend', 'ascend']}
                    showSorterTooltip={false}
                    loading={props.loading}
            />
        </div>
    );
}
