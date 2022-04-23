import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Space, Popconfirm, Form, Switch, Checkbox } from 'antd';
import './CtmplTable.css';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    // {
                    //     required: true,
                    //     message: `${title} is required.`,
                    // },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};


export default function CtmplTable(props) {
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            sorter: false,
            editable: true,
            width: 240,
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            sorter: false,
            editable: true,
            width: 100,
        },
        {
            title: '符号',
            dataIndex: 'symbol',
            key: 'symbol',
            sorter: false,
            editable: true,
            width: 100,
        },
        {
            title: '计算公式',
            dataIndex: 'expression',
            key: 'expression',
            sorter: false,
            editable: true,
            // width: '20%',
        },
        {
            title: '天平读取',
            dataIndex: '',
            key: 'scale',
            width: 70,
            render: (text, record) => (
                <Checkbox checked={record.is_read_auto} onChange={(e) => onCheckboxChange('scale', record, e)}/>
            ),
        },
        {
            title: '报告显示',
            dataIndex: '',
            key: 'display',
            width: 70,
            render: (text, record) => (
                <Checkbox checked={record.is_included_in_report} onChange={(e) => onCheckboxChange('display', record, e)}/>
            ),
        },
        {
            title: '最终结果',
            dataIndex: '',
            key: 'final',
            width: 70,
            render: (text, record) => (
                <Checkbox checked={record.is_final_result} onChange={(e) => onCheckboxChange('final', record, e)}/>
            ),
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action',
            width: 70,
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="您确定要删除吗？"
                        okText="是"
                        cancelText="取消"
                        onConfirm={() => handleDelete(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const onCheckboxChange = (tag, record, e) => {
        const newData = [...props.data];
        const index = newData.findIndex((item) => record.key === item.key);
        const item = {...newData[index]};
        if (tag === 'scale') {
            item.is_read_auto = e.target.checked;
        } else if (tag === 'display') {
            item.is_included_in_report = e.target.checked;
        } else if (tag === 'final') {
            item.is_final_result = e.target.checked;
        }
        newData.splice(index, 1, item);
        props.ptc_uploadData(newData);
    }

    const handleDelete = (record) => {
        const newData = [...props.data].filter((item) => item.key !== record.key);
        props.ptc_uploadData(newData);
    };

    const handleSave = (row) => {
        const newData = [...props.data];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        props.ptc_uploadData(newData);
    };

    const columnsPlus = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    return (
        <div className='mp-c-ctmpltable'>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={props.data}
                columns={columnsPlus}
                pagination={false}
            />
        </div>
    );
}