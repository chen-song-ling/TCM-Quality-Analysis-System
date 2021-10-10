import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Chrom.css';

// import { Modal, Space, notification } from 'antd';
import MpHeader from '../components/MpHeader';

import CropCntr from "../components/CropCntr";
import MarkCntr from "../components/MarkCntr";
import AttachmentDrawer from '../components/AttachmentDrawer';
import { SaveAsCsv } from "../util/Saver";

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function Chrom(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const dispatch = useDispatch();

    const chromId = useSelector(state => state.chrom.chromId);

    const [sizeboxData, setSizeboxData] = useState({width: "", height: "", err: "initErr"});
    const [cropImgList, setCropImgList] = useState([]);
    const [imgNaturalSize, setImgNaturalSize] = useState(null);
    const [cropBoxSizeList, setCropBoxSizeList] = useState([]);

    const [markedPoints, setMarkedPoints] = useState(null);
    const [scalingRatios, setScalingRatios] = useState([0, 0, 0, 0, 0]);

    const imgFileName = useRef("未命名"); // 上传色谱图片的文件名

    const [isAttachmentDrawerVisible, setIsAttachmentDrawerVisible] = useState(false);
    const [updateAttachmentToggle, setUpdateAttachmentToggle] = useState(0);

    //-- Protocol Begin

    const uploadSizeboxData = (newSizeboxData) => {
        setSizeboxData(newSizeboxData);
    }

    const uploadCropImg = (newCropImg) => {
        let newone = [...cropImgList];
        newone.push(newCropImg);
        setCropImgList(newone);
    }

    const uploadCropBoxSize = (newCropBoxData) => {
        let newone = [...cropBoxSizeList];
        newone.push(newCropBoxData);
        setCropBoxSizeList(newone);
    }

    const uploadImgNaturalSize = (newImgNaturalSize) => {
        setImgNaturalSize(newImgNaturalSize)
    }

    // 重新裁剪, 清空所有数据
    const triggerUndoCrop = () => {
        setCropImgList([]);
        setImgNaturalSize(null);
        setCropBoxSizeList([]);
    }

    // 获取新的色谱图的文件名
    const uploadImgFileName = (newImgFileName) => {
        imgFileName.current = newImgFileName;
    }

    // 选择了新图片, 清空所有数据
    const triggerSetNewImg = () => {
        setCropImgList([]);
        setImgNaturalSize(null);
        setCropBoxSizeList([]);
    }

    // 上传标记点数据
    const uploadMarkedPoints = (newMarkedPoints) => {
        setMarkedPoints(newMarkedPoints);
    }

    // 上传色谱缩放尺度信息
    const uploadScalingRatios = (newScalingRatios) => {
        setScalingRatios(newScalingRatios)
    }

    // 保存结果
    const triggerSaveResult = () => {

        // 没输入尺寸, 不能计算、保存
        if (sizeboxData.err !== "none") {
            return;
        }

        let defaultFileName = imgFileName.current;
        let csv = SaveAsCsv (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios);

        ipcRenderer.send("save-chrom-csv-with-dialog", {csv: csv, defaultFileName: defaultFileName});
        

    }

    // 附件管理
    const triggerShowAttachment = () => {
        setUpdateAttachmentToggle(updateAttachmentToggle+1);
        setIsAttachmentDrawerVisible(true);
    }

    //-- Protocol END


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

    const onAttachmentDrawerClose = () => {
        setIsAttachmentDrawerVisible(false);
    }

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

            <div className="mp-chrom-content">
                <CropCntr 
                    ptc_uploadSizeboxData={uploadSizeboxData}
                    ptc_uploadCropImg={uploadCropImg}
                    ptc_uploadImgFileName={uploadImgFileName}
                    ptc_uploadImgNaturalSize={uploadImgNaturalSize}
                    ptc_uploadCropBoxSize={uploadCropBoxSize}
                    ptc_triggerUndoCrop={triggerUndoCrop}
                    ptc_triggerSetNewImg={triggerSetNewImg}
                />
                <MarkCntr 
                    ptc_triggerSaveResult={triggerSaveResult}
                    ptc_triggerShowAttachment={triggerShowAttachment}
                    ptc_uploadMarkedPoints={uploadMarkedPoints}
                    ptc_uploadScalingRatios={uploadScalingRatios}

                    cropImgList={cropImgList}
                    cropBoxSizeList={cropBoxSizeList}
                />
            </div>

            <AttachmentDrawer
                visible={isAttachmentDrawerVisible}
                onClose={onAttachmentDrawerClose}
                updateToggle={updateAttachmentToggle}
            />
        </div>
    );
}
