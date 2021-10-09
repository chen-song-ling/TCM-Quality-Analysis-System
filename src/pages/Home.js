import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Home.css';

import { Modal, Space, notification } from 'antd';
import CompoundInput from '../components/CompoundInput';
import { setProjectId } from '../slices/projectSlice';
import { apiGetProjectsOverview } from '../util/api';
import HomeHeader from '../components/HomeHeader';
import HomeTable from '../components/HomeTable';


export default function Home(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const dispatch = useDispatch();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 1000,
    });
    const [loading, setLoading] = useState(true);

    // 两个Modal都用同一组
    const [inputName, setInputName] = useState("");
    const [inputSampleId, setInputSampleId] = useState("");
    const [inputStandard, setInputStandard] = useState("");
    const [inputNote, setInputNote] = useState("");

    useEffect(() => {
        apiGetProjectsOverview(username, pagination.current, "addingTime", "descend", pagination.pageSize).then((result) => {
            if (result.code == 200) {
                setData(result.data);
                setPagination(
                    {
                        ...pagination,
                        total: result.total
                    }
                )
                setLoading(false);
            }
        }).catch((err) => {
            
        });
    }, []);

    // -- BEGIN -- HomeHeader相关

    const onQuitClick = (e) => {
        setRedirect("/");
    }

    const onAddClick = (e) => {
        setInputName("");
        setInputSampleId("");
        setInputStandard("");
        setInputNote("");
        setIsAddModalVisible(true);
    }

    const onSearch = (value) => {
        console.log(value);
    }

    // -- END -- HomeHeader相关

    // -- BEGIN -- HomeTable相关

    // 查看操作
    const onExamineClick = (record) => {
        dispatch(setProjectId(record.id));
        setRedirect("/project");
    }

    const onEditClick = (record) => {
        setInputName(record.name);
        setInputSampleId(record.sampleId);
        setInputStandard(record.standard);
        setInputNote(record.note);
        setIsEditModalVisible(true);
       
    }

    const onTableChange = (pagination, filters, sorter) => {
        console.log(sorter);
        setLoading(true);
        apiGetProjectsOverview(username, pagination.current, sorter.field, sorter.order, pagination.pageSize).then((result) => {
            if (result.code == 200) {
                setData(result.data);
                setPagination({...pagination});
                setLoading(false);
            }
        }).catch((err) => {
            
        });

    };


    // -- END -- HomeTable相关


    // -- BEGIN -- EditModal相关

    const onEditProjectOk = () => {
        if (inputName === "" || inputSampleId === "" || inputStandard === "" || inputNote === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
            return;
        }
        setIsEditModalVisible(false);
    }

    const onEditProjectCancel = () => {
        setIsEditModalVisible(false);
    }

    const onEditRecordInputChange = (e, tag) => {
        if (tag === "name") {
            setInputName(e.target.value);
        } else if (tag === "sampleId") {
            setInputSampleId(e.target.value);
        } else if (tag === "standard") {
            setInputStandard(e.target.value);
        } else if (tag === "note") {
            setInputNote(e.target.value);
        }
    }

    // -- END -- EditModal相关

    // -- BEGIN -- AddModal相关

    const onAddProjectOk = () => {
        if (inputName === "" || inputSampleId === "" || inputStandard === "" || inputNote === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
            return;
        }
        setIsAddModalVisible(false);
    }

    const onAddProjectCancel = () => {
        setIsAddModalVisible(false);
    }

    const onAddRecordInputChange = (e, tag) => {
        if (tag === "name") {
            setInputName(e.target.value);
        } else if (tag === "sampleId") {
            setInputSampleId(e.target.value);
        } else if (tag === "standard") {
            setInputStandard(e.target.value);
        } else if (tag === "note") {
            setInputNote(e.target.value);
        }
    }

    // -- END -- AddModal相关

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <div className="mp-home">
            <HomeHeader
                username={username}
                onQuitClick={onQuitClick}
                onAddClick={onAddClick}
                onSearch={onSearch}
            />
            <HomeTable 
                onExamineClick={onExamineClick}
                onEditClick={onEditClick}
                onTableChange={onTableChange}
                data={data}
                pagination={pagination}
                loading={loading}
            />

            <Modal
                title="基本信息"
                visible={isEditModalVisible}
                onOk={onEditProjectOk}
                onCancel={onEditProjectCancel}
                okText="确认"
                cancelText="取消"
            >
                <Space className="mp-vlist" direction="vertical" size={'small'}>
                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="检品名称"
                        text={inputName}
                        isRequired={true}
                        textWidth={200}
                        maxLength={10}

                        onInputChange={(e) => onEditRecordInputChange(e, "name")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="项目编号"
                        text={inputSampleId}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}

                        onInputChange={(e) => onEditRecordInputChange(e, "sampleId")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="执行标准"
                        text={inputStandard}
                        isRequired={true}
                        textWidth={200}
                        maxLength={10}

                        onInputChange={(e) => onEditRecordInputChange(e, "standard")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="备注"
                        text={inputNote}
                        isRequired={false}
                        textWidth={200}
                        maxLength={100}

                        onInputChange={(e) => onEditRecordInputChange(e, "note")}
                    />
                </Space>
                
            </Modal>

            <Modal
                title="基本信息"
                visible={isAddModalVisible}
                onOk={onAddProjectOk}
                onCancel={onAddProjectCancel}
                okText="确认"
                cancelText="取消"
            >
                <Space className="mp-vlist" direction="vertical" size={'small'}>
                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="检品名称"
                        text={inputName}
                        isRequired={true}
                        textWidth={200}
                        maxLength={10}

                        onInputChange={(e) => onAddRecordInputChange(e, "name")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="项目编号"
                        text={inputSampleId}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}

                        onInputChange={(e) => onAddRecordInputChange(e, "sampleId")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="执行标准"
                        text={inputStandard}
                        isRequired={true}
                        textWidth={200}
                        maxLength={10}

                        onInputChange={(e) => onAddRecordInputChange(e, "standard")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="备注"
                        text={inputNote}
                        isRequired={false}
                        textWidth={200}
                        maxLength={100}

                        onInputChange={(e) => onAddRecordInputChange(e, "note")}
                    />
                </Space>
                
            </Modal>
        </div>
    );
}