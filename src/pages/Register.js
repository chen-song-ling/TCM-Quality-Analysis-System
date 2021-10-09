import React from 'react'
import { useState, useEffect } from "react";
import './Register.css';
import { Input, Button, Space, notification } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { apiRegister } from '../util/api';
import { useSelector, useDispatch } from 'react-redux';


export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const [redirect, setRedirect] = useState(null);
    const path = useSelector(state => state.global.path)
    const dispatch = useDispatch()

    const onInputChange = (tag, e) => {
        switch (tag) {
            case "name":
                setName(e.target.value);
                break;
            case "username":
                setUsername(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            case "confPassword":
                setConfPassword(e.target.value);
                break;
            default:
                break;
        }
    };

    const onRegisterClick = (e) => {

        if (name === "" || username === "" || password === "" || confPassword === "") {
            notification.open({
                message: "注册失败",
                description: "请输入所有必选项目",
            });
            return;
        }

        if (password !== confPassword) {
            notification.open({
                message: "注册失败",
                description: "两次输入的密码不一致",
            });
            return;
        }

        apiRegister(username, password).then((result) => {
            if (result.code == 200) {
                notification.open({
                    message: "注册成功",
                });
                setRedirect("/");
            }
        }).catch((err) => {
            notification.open({
                message: "注册失败",
                description: "服务器错误",
            });
            return;
        });
    };

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <div className="mp-register">
            <img className="mp-register-pic" src={path + "./szifdc-logo.png"} alt="" />

            <div className="mp-register-box">
                <h1>用户注册</h1>
                <Space direction="vertical" size={'middle'}>
                    <Input className="mp-register-input" addonBefore={<><span style={{color: "red"}}>* </span> <span>姓名</span></>} defaultValue="" value={name} onChange={(e)=>onInputChange("name", e)} />
                    <Input className="mp-register-input" addonBefore={<><span style={{color: "red"}}>* </span> <span>用户名</span></>} defaultValue="" value={username} onChange={(e)=>onInputChange("username", e)} />
                    <Input className="mp-register-input" type="password" addonBefore={<><span style={{color: "red"}}>* </span> <span>密码</span></>} defaultValue="" value={password} onChange={(e)=>onInputChange("password", e)} />
                    <Input className="mp-register-input" type="password" addonBefore={<><span style={{color: "red"}}>* </span> <span>确认密码</span></>} defaultValue="" value={confPassword} onChange={(e)=>onInputChange("confPassword", e)} />
                
                <div className="mp-vlist">

                    <div className="mp-register-btnlist">
                        <Space size={'large'}>
                            <Button type="primary" size={'large'} onClick={onRegisterClick}>
                                注册
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