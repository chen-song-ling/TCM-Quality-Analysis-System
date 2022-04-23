import React from 'react';
import './ClistTable.css';
import { Popconfirm, Table, Space } from 'antd';

export default function ClistTable(props) {

    const columns = [
        {
            title: '模版名称',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            // width: '20%',
        },
        {
            title: '添加时间',
            dataIndex: 'addingTime',
            key: 'addingTime',
            defaultSortOrder: "descend",
            sorter: true,
            // width: '20%',
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {/* <a onClick={() => props.onExamineClick(record)}>查看</a> */}
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
        <div className="mp-c-clisttable">
            <Table className="mp-clist-table"
                columns={columns}
                rowKey={record => record.key}
                dataSource={props.data}
                pagination={props.pagination}
                onChange={props.onTableChange}
                sortDirections={['ascend', 'descend', 'ascend']}
                showSorterTooltip={false}
                loading={props.loading}
            />
        </div>
    );
}
