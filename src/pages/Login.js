import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Login.css';
import { Input, Button, Space, notification } from 'antd';
import { setPath, setUsername, setAccessToken } from '../slices/globalSlice';
import { apiLogin } from '../util/api';

export default function Login() {
    const [redirect, setRedirect] = useState(null);
    const dispatch = useDispatch();
    const path = useSelector(state => state.global.path);

    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    // 获取程序绝对路径
    useEffect(() => {
        if (path === undefined) {
            let raw = window.location.href;
            // console.log(raw);
            if (raw.substring(0, 4) === "file") {
                dispatch(setPath(raw.substring(7, raw.length-10)));
            } else {
                dispatch(setPath(""));
            }
        }
    }, []);

    const onInputChange = (tag, e) => {
        switch (tag) {
            case "username":
                setInputUsername(e.target.value);
                break;
            case "password":
                setInputPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    const onLoginClick = (e) => {

        // -- BEGIN 测试用路径

        if (inputUsername === "t") {
            setRedirect("/chrom");
            return;
        }

        // -- END 测试用路径

        if (inputPassword === "" || inputUsername === "") {
            notification.open({
                message: "登录失败",
                description: "请输入所有必选项目。",
            });
            return;
        }

        apiLogin(inputUsername, inputPassword).then((res) => {

            if (res.data.access_token !== undefined) {

                dispatch(setUsername(inputUsername));
                dispatch(setAccessToken(res.data.access_token));
                setRedirect("/home");
            } else {
                notification.open({
                    message: "登录失败",
                    description: "用户名或密码错误。",
                });
            }
        }).catch((err) => {
            console.log(err);
            notification.open({
                message: "登录失败",
                description: "用户名或密码错误。",
            });
            return;
        });
    }



    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <div className="mp-login">
            <img className="mp-login-logo" src={path + "szifdc-logo.png"} alt="" />

            <div className="mp-vlist">
                <h1>用户登陆</h1>
                <Space direction="vertical" size={'middle'}>
                    <Input className="mp-login-input" addonBefore={<><span style={{color: "red"}}>* </span> <span>用户名</span></>} defaultValue="" value={inputUsername} onChange={(e)=>onInputChange("username", e)} />
                    <Input className="mp-login-input" type="password" addonBefore={<><span style={{color: "red"}}>* </span> <span>密码</span></>} defaultValue="" value={inputPassword} onChange={(e)=>onInputChange("password", e)} />
                
                <div className="mp-vlist">

                    <div className="mp-login-btnlist">
                        <Space size={'large'}>
                            <Button type="primary" size={'large'} onClick={onLoginClick}>
                                登陆
                            </Button>

                            <Link to="/register" >
                                <Button size={'large'}>
                                    注册
                                </Button>
                            </Link>

                            <Link to="/admin-register">
                                <Button size={'large'}>
                                    管理员登陆
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