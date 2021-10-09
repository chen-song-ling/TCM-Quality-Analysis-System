import React from 'react'
import { useState, useEffect } from "react";
import './AdminLogin.css';
import { Input, Button, Space, notification } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { apiAdminLogin } from '../util/api';
import { useSelector, useDispatch } from 'react-redux';


export default function AdminLogin() {
    const [password, setPassword] = useState("");

    const [redirect, setRedirect] = useState(null);
    const path = useSelector(state => state.global.path)
    const dispatch = useDispatch()

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    const onInputChange = (tag, e) => {
        switch (tag) {
            case "password":
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    const onLoginClick = (e) => {

        if (password === "") {
            notification.open({
                message: "登录失败",
                description: "请输入所有必选项目。",
            });
            return;
        }

        apiAdminLogin(password).then((result) => {
            if (result.code == 200) {

            }
        }).catch((err) => {
            notification.open({
                message: "登录失败",
                description: "密码错误。",
            });
            return;
        });
    }

    return (
        <div className="mp-adlogin">
            <img className="mp-adlogin-pic" src={path + "./szifdc-logo.png"} alt="" />

            <div className="mp-adlogin-box">
                <h1>管理员登陆</h1>
                <Space direction="vertical" size={'middle'}>
                    <Input className="mp-adlogin-input" type="password" addonBefore={<><span style={{color: "red"}}>* </span> <span>密码</span></>} defaultValue="" value={password} onChange={(e)=>onInputChange("password", e)} />
                
                <div className="mp-vlist">

                    <div className="mp-adlogin-btnlist">
                        <Space size={'large'}>
                            <Button type="primary" size={'large'} onClick={onLoginClick}>
                                登陆
                            </Button>

                            <Link to="/" >
                                <Button size={'large'}>
                                    取消
                                </Button>
                            </Link>
                        </Space>
                    </div>
                </div>

                </Space>
            </div>
        </div>
    );
}
