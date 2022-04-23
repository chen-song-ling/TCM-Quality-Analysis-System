import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Home.css';

import { Layout, Menu, Modal, Space, notification } from 'antd';
import CompoundInput from '../components/CompoundInput';
import { setProjectId } from '../slices/projectSlice';
import { apiGetUserMe, apiGetProjectList, apiAddProject, apiDeleteProject, apiUpdateProject } from '../util/api';
import HomeHeader from '../components/HomeHeader';
import HomeTable from '../components/HomeTable';
import HomeSider from '../components/HomeSider';

const { Header, Content, Sider } = Layout;

export default function Home(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const accessToken = useSelector(state => state.global.accessToken);
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

    const [editRecord, setEditRecord] = useState("");
    // 两个Modal都用同一组
    const [inputName, setInputName] = useState("");
    const [inputSampleId, setInputSampleId] = useState("");
    const [inputStandard, setInputStandard] = useState("");
    const [inputNote, setInputNote] = useState("");

    const [searchKey, setSearchKey] = useState("");
    const [sortOrder, setSortOrder] = useState("descend");
    const [sortField, setSortField] = useState("creation_time");

    const [isAdministrator, setIsAdministrator] = useState(false);


    const updateProjectList = () => {
        apiGetProjectList(accessToken, (pagination.current - 1) * pagination.pageSize, pagination.pageSize, sortField, sortOrder, searchKey).then((res) => {
            // console.log(res.data);
            let data = res.data;
            let newData = [];
            data.data.forEach(item => {
                let date = new Date(item.creation_time);
                let dateStr = date.getFullYear() + "-" + `${date.getMonth() + 1}`.padStart(2, '0') + "-" + `${date.getDate()}`.padStart(2, '0');
                newData.push({
                    key: item.id,
                    id: item.id,
                    name: item.name,
                    addingTime: dateStr,
                    sampleId: item.number,
                    standard: item.standard,
                    note: item.note,
                    additionalFields: item.additional_fields,
                    attachments: item.attachments,
                });
            });
            setData(newData);
            setPagination(
                {
                    ...pagination,
                    total: data.total
                }
            );
            setLoading(false);

        }).catch((err) => {
            console.log(err);
        });
    };

    const updateSiderItem = () => {
        apiGetUserMe(accessToken).then((res) => {
            // console.log(res);
            if (res.data.is_superuser === true) {
                setIsAdministrator(true);
            }
        }).catch((err) => {
            console.log(err);
        }); 
    }

    useEffect(() => {

        updateProjectList();

    }, [searchKey]);

    useEffect(() => {
        updateProjectList();
        updateSiderItem();

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
        // console.log(value);
        setSearchKey(value);
    }

    // -- END -- HomeHeader相关

    // -- BEGIN -- HomeTable相关

    // 查看操作
    const onExamineClick = (record) => {
        dispatch(setProjectId(record.id));
        setRedirect("/project");
    }

    const onEditClick = (record) => {
        setEditRecord(record);
        setInputName(record.name);
        setInputSampleId(record.sampleId);
        setInputStandard(record.standard);
        setInputNote(record.note);
        setIsEditModalVisible(true);

    }

    const onDeleteClick = (record) => {
        apiDeleteProject(accessToken, record.id).then((res) => {
            // console.log(res);
            updateProjectList();
        }).catch((err) => {
            console.log(err);
        });
    }

    const onTableChange = (pagination, filters, sorter) => {
        let sort_by_field = sorter.field;
        if (sort_by_field === "sampleId") {
            sort_by_field = "number";
            setSortField("number");
        } else if (sort_by_field === "addingTime") {
            sort_by_field = "creation_time";
            setSortField("creation_time");
        }
        setSortOrder(sorter.order);

        apiGetProjectList(accessToken, (pagination.current - 1) * pagination.pageSize, pagination.pageSize, sort_by_field, sorter.order, searchKey).then((res) => {
            // console.log(res.data);
            let data = res.data;

            let newData = [];
            data.data.forEach(item => {
                let date = new Date(item.creation_time);
                let dateStr = date.getFullYear() + "-" + `${date.getMonth() + 1}`.padStart(2, '0') + "-" + `${date.getDate()}`.padStart(2, '0');
                newData.push({
                    key: item.id,
                    id: item.id,
                    name: item.name,
                    addingTime: dateStr,
                    sampleId: item.number,
                    standard: item.standard,
                    note: item.note,
                });
            });
            setData(newData);
            setPagination(
                {
                    ...pagination,
                    total: data.total
                }
            );
            setLoading(false);

        }).catch((err) => {
            console.log(err);
        });

    };


    // -- END -- HomeTable相关


    // -- BEGIN -- EditModal相关

    const onEditProjectOk = () => {
        if (inputName === "" || inputSampleId === "" || inputStandard === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
        } else {
            console.log(editRecord);
            apiUpdateProject(accessToken, inputName, inputSampleId, inputStandard, inputNote, editRecord.additionalFields, editRecord.attachments, editRecord.id).then((res) => {
                // console.log(res);
            }).catch((err) => {
                console.log(err);
            });
            updateProjectList();
            setIsEditModalVisible(false);
        }
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
        if (inputName === "" || inputSampleId === "" || inputStandard === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
        } else {
            apiAddProject(accessToken, inputName, inputSampleId, inputStandard, inputNote).then((res) => {
                console.log(res);
                updateProjectList();
            }).catch((err) => {
                console.log(err);
            });
            setIsAddModalVisible(false);
        }


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

    // -- BEGIN -- Sider相关

    const handleMenuItemClick = (idx, e) => {
        // console.log(idx);
        if (idx === '0') {
            setRedirect("/me");
        } else if (idx === '2') {
            setRedirect("/bank");
        } else if (idx === '3') {
            setRedirect("/clist");
        }
    }

    // -- END -- Sider相关

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <Layout
            className="mp-home-layout"
        >

            <HomeSider 
                defaultSelectedKey='1'
                isAdministrator={isAdministrator}
                handleMenuItemClick={handleMenuItemClick}
            />

            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
            >

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
                        onDeleteClick={onDeleteClick}
                        onTableChange={onTableChange}
                        data={data}
                        pagination={pagination}
                        loading={loading}
                    />

                    <Modal
                        title="编辑项目"
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
                        title="添加项目"
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
            </Content>
        </Layout>
    );
}