import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Me.css';

import { Button, Layout, Menu, Modal, Space, notification } from 'antd';
import { apiGetUserMe, apiPutUserMe } from '../util/api';
import HomeSider from '../components/HomeSider';
import CompoundInput from '../components/CompoundInput';


const { Header, Content, Sider } = Layout;

// a 111111

export default function Me(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const accessToken = useSelector(state => state.global.accessToken);
    const dispatch = useDispatch();

    const [inputName, setInputName] = useState("");
    const [inputUserName, setInputUserName] = useState("");
    const [inputIsAdministrator, setInputIsAdministrator] = useState("否");

    const [inputPassword1, setInputPassword1] = useState("");
    const [inputPassword2, setInputPassword2] = useState("");


    const [isAdministrator, setIsAdministrator] = useState(false);

    const updateSiderItem = () => {
        apiGetUserMe(accessToken).then((res) => {
            // console.log(res);
            if (res.data.is_superuser === true) {
                setIsAdministrator(true);
                setInputIsAdministrator("是");
            }
            setInputName(res.data.full_name);
            setInputUserName(res.data.email);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        updateSiderItem();
    }, []);

    const handleMenuItemClick = (idx, e) => {
        if (idx === '1') {
            setRedirect("/home");
        } else if (idx === '2') {
            setRedirect("/bank");
        } else if (idx === '3') {
            setRedirect("/clist");
        }
    }

    const onInputChange = (e, tag) => {
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

    const onUpdateInfoClick = () => {
        if (inputName === "" || inputUserName === "" || inputPassword1 === "" || inputPassword2 === "") {
            notification.open({
                message: "修改信息失败",
                description: "请补充完整输入栏",
            });
        } else if (inputPassword1 !== inputPassword2) {
            notification.open({
                message: "修改密码失败",
                description: "两次输入的密码不一致",
            });
        } else if (inputPassword1.length < 6) {
            notification.open({
                message: "修改密码失败",
                description: "新的密码太短，至少需要6位",
            });
        } else {
            apiPutUserMe(accessToken, inputName, inputUserName, inputPassword1).then((res) => {
                console.log(res);
                notification.open({
                    message: "修改信息成功",
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const onUpdatePasswordClick = () => {
        if (inputPassword1 === "" || inputPassword2 === "") {
            notification.open({
                message: "修改密码失败",
                description: "请补充完整输入栏",
            });
        } else if (inputPassword1 !== inputPassword2) {
            notification.open({
                message: "修改密码失败",
                description: "两次输入的密码不一致",
            });
        } else if (inputPassword1.length < 6) {
            notification.open({
                message: "修改密码失败",
                description: "新的密码太短，至少需要6位",
            });
        } else {
            apiGetUserMe(accessToken).then((res) => {

            }).catch((err) => {
                console.log(err);
            });

            notification.open({
                message: "修改密码成功",
            });
        }
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
                defaultSelectedKey='0'
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
                <Space
                    className="mp-vlist"
                    direction="vertical"
                    size={'small'}
                    style={{ marginTop: 150 }}
                >
                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="真实姓名"
                        text={inputName}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}

                        onInputChange={(e) => onInputChange(e, "name")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="用户名"
                        text={inputUserName}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}

                        onInputChange={(e) => onInputChange(e, "username")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="是否管理员"
                        text={inputIsAdministrator}
                        isRequired={false}
                        textWidth={200}
                        maxLength={30}
                        isDisabled={true}

                        onInputChange={(e) => onInputChange(e, "isadministrator")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="新密码"
                        text={inputPassword1}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}
                        isPassword={true}

                        onInputChange={(e) => onInputChange(e, "password1")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="重复新密码"
                        text={inputPassword2}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}
                        isPassword={true}

                        onInputChange={(e) => onInputChange(e, "password2")}
                    />

                    <Button type="primary" size={'large'} onClick={onUpdateInfoClick} style={{ marginBottom: 40 }}>
                        修改信息
                    </Button>

                    {/* <CompoundInput
                        isSwitchHidden={true}
                        fieldName="新密码"
                        text={inputPassword1}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}
                        isPassword={true}

                        onInputChange={(e) => onAddRecordInputChange(e, "password1")}
                    />

                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="重复新密码"
                        text={inputPassword2}
                        isRequired={true}
                        textWidth={200}
                        maxLength={30}
                        isPassword={true}

                        onInputChange={(e) => onAddRecordInputChange(e, "password2")}
                    />

                    <Button type="primary" size={'large'} onClick={onUpdatePasswordClick}>
                        修改密码
                    </Button> */}
                </Space>
            </Content>


        </Layout>
    )
}
