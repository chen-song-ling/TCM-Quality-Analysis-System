import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Chrom.css';

import { Modal, Space, notification } from 'antd';
import MpHeader from '../components/MpHeader';

export default function Chrom(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const dispatch = useDispatch();

    const chromId = useSelector(state => state.chrom.chromId);

    // -- BEGIN -- MpHeader相关

    const onQuitClick = (e) => {
        setRedirect("/");
    }

    const onBreadClick = (e, tag) => {
        switch (tag) {
            case "home":
                setRedirect("/home");
                break;
            case "project":
                setRedirect("/project");
                break;
            default:
                break;
        }
    }

    // -- END -- MpHeader相关

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <div className="mp-chrom">
            <MpHeader
                onQuitClick={onQuitClick}
                onBreadClick={onBreadClick}
                username={username}
                breadItems = {[
                    {
                        text: "首页",
                        isActive: true,
                        funcTag: "home",
                    },
                    {
                        text: "项目",
                        isActive: true,
                        funcTag: "project",
                    },
                    {
                        text: "薄层",
                        isActive: false,
                    },
                ]}
            />
        </div>
    );
}
