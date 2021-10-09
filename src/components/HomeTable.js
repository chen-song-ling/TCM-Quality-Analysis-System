import React from 'react';
import './HomeTable.css';
import { Table, Space } from 'antd';

export default function HomeTable(props) {

    const columns = [
        {
            title: '检品名称',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            // width: '20%',
        },
        {
            title: '添加时间',
            dataIndex: 'addingTime',
            key: 'addingTime',
            sorter: true,
            defaultSortOrder: "descend"
            // width: '20%',
        },
        {
            title: '检品编号',
            dataIndex: 'sampleId',
            key: 'sampleId',
            sorter: true,
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => props.onExamineClick(record)}>查看</a>
                    <a onClick={() => props.onEditClick(record)}>编辑</a>
                    <a>删除</a>
                </Space>
            ),
        },
    ];

    return (
        <div className="mp-c-hometable">
            <Table className="mp-home-table"
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