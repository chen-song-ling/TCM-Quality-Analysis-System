import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Bank.css';

import { Button, Layout, Menu, Modal, Space, notification } from 'antd';
import { apiGetAccountList, apiAddAccount, apiUpdateAccount, apiDeleteAccount } from '../util/api';
import HomeSider from '../components/HomeSider';
import BankHeader from '../components/BankHeader';
import BankTable from '../components/BankTable';
import CompoundInput from '../components/CompoundInput';
import CompoundSelect from '../components/CompoundSelect';


const { Header, Content, Sider } = Layout;

export default function Bank(props) {
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
    const [editRecord, setEditRecord] = useState(null);

    const [inputName, setInputName] = useState("");
    const [inputUserName, setInputUserName] = useState("");
    const [inputIsAdministrator, setInputIsAdministrator] = useState("否");
    const [inputPassword1, setInputPassword1] = useState("");
    const [inputPassword2, setInputPassword2] = useState("");

    const [isSelectDisabled, setIsSelectDisabled] = useState(false);

    const [searchKey, setSearchKey] = useState("");
    const [sortOrder, setSortOrder] = useState("descend");
    const [sortField, setSortField] = useState("isadministrator");

    const updateAccountList = () => {
        apiGetAccountList(accessToken, (pagination.current - 1) * pagination.pageSize, pagination.pageSize, sortField, sortOrder, searchKey).then((res) => {
            // console.log(res.data);
            let data = res.data;
            let newData = [];
            data.forEach(item => {
                newData.push({
                    key: item.id,
                    id: item.id,
                    name: item.full_name,
                    username: item.email,
                    isadministrator: item.is_superuser ? "是" : "否",
                });
            });
            setData(newData);
            setPagination(
                {
                    ...pagination,
                    // total: data.total
                    total: data.length
                }
            );
            setLoading(false);

        }).catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        updateAccountList();
    }, []);

    useEffect(() => {
        updateAccountList();
    }, [searchKey]);


    // -- BEGIN -- HomeSider相关

    const handleMenuItemClick = (idx, e) => {
        if (idx === '0') {
            setRedirect("/me");
        } else if (idx === '1') {
            setRedirect("/home");
        } else if (idx === '3') {
            setRedirect("/clist");
        }
    }

    // -- BEGIN -- HomeSider相关

    // -- BEGIN -- BankTable相关

    // 查看操作
    const onExamineClick = (record) => {

    }

    const onEditClick = (record) => {
        if (record.username === username) {
            setIsSelectDisabled(true);
        }

        setEditRecord(record);
        setInputName(record.name);
        setInputUserName(record.username);
        setInputIsAdministrator(record.isadministrator);
        setInputPassword1("");
        setInputPassword2("");
        setIsEditModalVisible(true);

    }

    const onDeleteClick = (record) => {
        if (record.username === username) {
            notification.open({
                message: "删除失败",
                description: "无法删除自己的账号",
            });
        } else {
            apiDeleteAccount(accessToken, record.id).then((res) => {
                setLoading(true);
                updateAccountList();
            }).catch((err) => {
                console.log(err);
                notification.open({
                    message: "删除失败",
                });
            });
        }
        // apiDeleteProject(accessToken, record.id).then((res) => {
        //     // console.log(res);
        //     updateProjectList();
        // }).catch((err) => {
        //     console.log(err);
        // });
    }

    const onTableChange = (pagination, filters, sorter) => {

    };


    // -- END -- BankTable相关

    // -- BEGIN -- EditModal相关

    const onEditAccountOk = () => {
        if (inputName === "" || inputUserName === "" || inputPassword1 === "" || inputPassword2 === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
        } else {
            console.log(editRecord);
            let is_administrator = inputIsAdministrator === "是";
            apiUpdateAccount(accessToken, inputName, inputUserName, inputPassword1, is_administrator, editRecord.id).then((res) => {
                // console.log(res);
                setLoading(true);
                updateAccountList();
            }).catch((err) => {
                console.log(err);
                notification.open({
                    message: "修改失败",
                });
            });

            setIsEditModalVisible(false);
        }
    }

    const onEditAccountCancel = () => {
        setIsEditModalVisible(false);
    }

    const onEditRecordInputChange = (e, tag) => {
        if (tag === "name") {
            setInputName(e.target.value);
        } else if (tag === "username") {
            setInputUserName(e.target.value);
        } else if (tag === "password1") {
            setInputPassword1(e.target.value);
        } else if (tag === "password2") {
            setInputPassword2(e.target.value);
        }
    }

    const onEditRecordSelectChange = (value) => {
        setInputIsAdministrator(value);
    }

    // -- END -- EditModal相关

    // -- BEGIN -- AddModal相关

    const onAddClick = (e) => {
        setInputName("");
        setInputUserName("");
        setInputIsAdministrator("否");
        setInputPassword1("");
        setInputPassword2("");
        setIsAddModalVisible(true);
    }

    const onAddAccountOk = () => {
        if (inputName === "" || inputUserName === "" || inputPassword1 === "" || inputPassword2 === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
        } else {
            let is_administrator = inputIsAdministrator === "是";
            apiAddAccount(accessToken, inputName, inputUserName, inputPassword1, is_administrator).then((res) => {
                console.log(res);
                setLoading(true);
                updateAccountList();
            }).catch((err) => {
                console.log(err);
                notification.open({
                    message: "添加失败",
                });
            });

            setIsAddModalVisible(false);
        }
    }

    const onAddAccountCancel = () => {
        setIsAddModalVisible(false);
    }

    const onAddRecordInputChange = (e, tag) => {
        if (tag === "name") {
            setInputName(e.target.value);
        } else if (tag === "username") {
            setInputUserName(e.target.value);
        } else if (tag === "password1") {
            setInputPassword1(e.target.value);
        } else if (tag === "password2") {
            setInputPassword2(e.target.value);
        }
    }

    const onAddRecordSelectChange = (value) => {
        setInputIsAdministrator(value);
    }

    // -- END -- AddModal相关

    const onSearch = (value) => {
        setSearchKey(value);
    }


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
                defaultSelectedKey='2'
                isAdministrator={true}
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
                <BankHeader
                    onAddClick={onAddClick}
                    onSearch={onSearch}
                />

                <BankTable
                    onExamineClick={onExamineClick}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onTableChange={onTableChange}
                    data={data}
                    pagination={pagination}
                    loading={loading}
                />

                <Modal
                    title="编辑账号"
                    visible={isEditModalVisible}
                    onOk={onEditAccountOk}
                    onCancel={onEditAccountCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Space className="mp-vlist" direction="vertical" size={'small'}>
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="真实姓名"
                            text={inputName}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}

                            onInputChange={(e) => onEditRecordInputChange(e, "name")}
                        />
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="用户名"
                            text={inputUserName}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}

                            onInputChange={(e) => onEditRecordInputChange(e, "username")}
                        />
                        <CompoundSelect
                            fieldName="是否管理员"
                            textWidth={200}
                            isRequired={true}
                            defaultValue={inputIsAdministrator}
                            isDisabled={isSelectDisabled}

                            options={[
                                {
                                    value: "是",
                                    text: "是",
                                },
                                {
                                    value: "否",
                                    text: "否",
                                }
                            ]}

                            onSelectChange={onEditRecordSelectChange}
                        />
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="新密码"
                            text={inputPassword1}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}
                            isPassword={true}

                            onInputChange={(e) => onEditRecordInputChange(e, "password1")}
                        />
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="重复新密码"
                            text={inputPassword2}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}
                            isPassword={true}

                            onInputChange={(e) => onEditRecordInputChange(e, "password2")}
                        />
                    </Space>
                </Modal>

                <Modal
                    title="添加账号"
                    visible={isAddModalVisible}
                    onOk={onAddAccountOk}
                    onCancel={onAddAccountCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Space className="mp-vlist" direction="vertical" size={'small'}>
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="真实姓名"
                            text={inputName}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}

                            onInputChange={(e) => onAddRecordInputChange(e, "name")}
                        />
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="用户名"
                            text={inputUserName}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}

                            onInputChange={(e) => onAddRecordInputChange(e, "username")}
                        />
                        <CompoundSelect
                            fieldName="是否管理员"
                            textWidth={200}
                            isRequired={true}
                            defaultValue={inputIsAdministrator}

                            options={[
                                {
                                    value: "是",
                                    text: "是",
                                },
                                {
                                    value: "否",
                                    text: "否",
                                }
                            ]}

                            onSelectChange={onAddRecordSelectChange}
                        />
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="密码"
                            text={inputPassword1}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}
                            isPassword={true}

                            onInputChange={(e) => onAddRecordInputChange(e, "password1")}
                        />
                        <CompoundInput
                            isSwitchHidden={true}
                            fieldName="重复密码"
                            text={inputPassword2}
                            isRequired={true}
                            textWidth={200}
                            maxLength={30}
                            isPassword={true}

                            onInputChange={(e) => onAddRecordInputChange(e, "password2")}
                        />
                    </Space>
                </Modal>


            </Content>
        </Layout>
    );
}
