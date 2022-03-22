import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Chrom.css';

import { Modal, Space, notification } from 'antd';
import MpHeader from '../components/MpHeader';

import CropCntr from "../components/CropCntr";
import MarkCntr from "../components/MarkCntr";
import AttachmentDrawerPlus from '../components/AttachmentDrawerPlus';
import { SaveAsCsv, SaveAsXlsx, SaveAsCsvPlus, SaveAsXlsxPlus } from "../util/Saver";
import { MPListList } from "../util/MPListList";
import { apiGetTask, apiUpdateTask, apiGetTaskReport } from '../util/api';


const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function Chrom(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const accessToken = useSelector(state => state.global.accessToken);
    const taskName = useSelector(state => state.global.taskName);

    const dispatch = useDispatch();

    const chromId = useSelector(state => state.chrom.chromId);

    const [sizeboxData, setSizeboxData] = useState({width: "", height: "", err: "initErr"});
    const [cropImgList, setCropImgList] = useState([]);
    const [imgNaturalSize, setImgNaturalSize] = useState(null);
    const [cropBoxSizeList, setCropBoxSizeList] = useState([]);

    const [markedPoints, setMarkedPoints] = useState(new MPListList(5));
    const [scalingRatios, setScalingRatios] = useState([0, 0, 0, 0, 0]);

    const imgFileName = useRef("未命名"); // 上传色谱图片的文件名

    const [isAttachmentDrawerVisible, setIsAttachmentDrawerVisible] = useState(false);
    const [attachmentDrawerUpdateToggle, setAttachmentDrawerUpdateToggle] = useState(0);

    // const [snapshotData, setSnapshotData] = useState('{"sizeboxData":{"width":"10","height":"10","err":"none"},"imgNaturalSize":{"width":473,"height":472},"cropBoxSizeList":[{"width":58.37632135306553,"height":389.1754756871035},{"width":58.37632135306553,"height":389.1754756871035},{"width":58.37632135306553,"height":389.1754756871035}],"markedPoints":{"fpListGroup":[[-1,0],[-1,0],[-1],[-1],[-1]],"mpListGroup":[{"list":[{"x":55,"y":219,"type":"fix","link":-1,"color":"(17; 110; 176)"},{"x":55,"y":375,"type":"key","link":0,"color":"(5; 35; 60)"},{"x":55,"y":129,"type":"key","link":0,"color":"(7; 45; 80)"},{"x":55,"y":129,"type":"key","link":0,"color":"(44; 98; 41)"}]},{"list":[{"x":55,"y":130,"type":"fix","link":-1,"color":"(8; 25; 46)"},{"x":55,"y":379,"type":"key","link":0,"color":"(17; 16; 28)"}]},{"list":[{"x":55,"y":218,"type":"key","link":-1,"color":"(8; 53; 91)"}]},{"list":[]},{"list":[]}]},"scalingRatios":[1.027813993915689,1.027813993915689,1.027813993915689,0,0]}');
    // const [snapshotRawImg, setSnapshotRawImg] = useState("https://s4.ax1x.com/2022/02/14/HyESqP.jpg");
    // const [snapshotCropImgList, setSnapshotCropImgList] = useState(["https://s4.ax1x.com/2022/02/14/HyAjxA.png", "https://s4.ax1x.com/2022/02/14/HyAjxA.png", "https://s4.ax1x.com/2022/02/14/HyAjxA.png"]);

    const [snapshotData, setSnapshotData] = useState("");
    const [snapshotRawImg, setSnapshotRawImg] = useState(null);
    const [snapshotCropImgList, setSnapshotCropImgList] = useState([]);

    useEffect(() => {
        apiGetTask(accessToken, chromId).then((res) => {

            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    })

    useEffect(() => {
        // 存在快照则使用快照
        if (snapshotRawImg !== null) {
            let snapshot = JSON.parse(snapshotData);

            setScalingRatios(snapshot.scalingRatios);
            setSizeboxData(snapshot.sizeboxData);
            setImgNaturalSize(snapshot.imgNaturalSize);
            setCropBoxSizeList(snapshot.cropBoxSizeList);
            setMarkedPoints(new MPListList(snapshot.markedPoints));
            setCropImgList(snapshotCropImgList);
        }
    }, [snapshotRawImg]);

    // 获取快照
    const snap = () => {
        let snapshot = {};
        snapshot.sizeboxData = sizeboxData;
        snapshot.imgNaturalSize = imgNaturalSize;
        snapshot.cropBoxSizeList = cropBoxSizeList;

        snapshot.markedPoints = markedPoints;
        snapshot.scalingRatios = scalingRatios;

        return JSON.stringify(snapshot);
    }

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
        setImgNaturalSize(newImgNaturalSize);
    }

    const uploadSnapshot = () => {
        console.log(snap());

        apiGetTask(accessToken, chromId).then((res) => {
            let result = {...res.data.result}
            result.result_str="1";
            console.log(result);
            apiUpdateTask(accessToken, res.data.name, res.data.type, res.data.id, "characterStandard", "characterManualResult", [], res.data.attachments, result, res.data.sub_type).then((res) => {
                notification.open({
                    message: "保存成功",
                });
                console.log(res)
            }).catch((err) => {
                notification.open({
                    message: "保存失败",
                    description: "网络错误。",
                });
                console.log(err);
            });
            
        }).catch((err) => {
            console.log(err);
        });
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

        // 没输入尺寸, 不能计算, 保存
        if (sizeboxData.err !== "none") {
            return;
        }

        // 没原始尺寸, 不能计算, 保存
        if (imgNaturalSize === null) {
            return;
        }

        let defaultFileName = imgFileName.current;
        // let csv = SaveAsCsv (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios);
        // let xlsx = SaveAsXlsx (sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios);
        let csv = SaveAsCsvPlus(sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios);
        let xlsx = SaveAsXlsxPlus(sizeboxData, imgNaturalSize, cropBoxSizeList, markedPoints, scalingRatios);
        console.log(xlsx);
        // ipcRenderer.send("save-chrom-csv-with-dialog", {csv: csv, defaultFileName: defaultFileName});
        ipcRenderer.send("save-chrom-xlsx-with-dialog", {xlsx: xlsx, csv: csv, defaultFileName: defaultFileName});
        

    }

    // 附件管理
    const triggerShowAttachment = () => {
        // setUpdateAttachmentToggle(updateAttachmentToggle+1);
        setIsAttachmentDrawerVisible(true);
        
        // console.log(snap());
    }

    //-- Protocol END


    // -- BEGIN -- MpHeader相关

    const onHeaderBackClick = (e) => {
        setRedirect("/project");
    }

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
                onHeaderBackClick={onHeaderBackClick}
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
                        text: taskName,
                        isActive: false,
                    },
                ]}
            />

            <div className="mp-chrom-content">
                <CropCntr 
                    snapshotRawImg={snapshotRawImg}

                    sizeboxData={sizeboxData}

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
                    ptc_triggerUploadResult={uploadSnapshot}

                    cropImgList={cropImgList}
                    cropBoxSizeList={cropBoxSizeList}

                    markedPoints={markedPoints}
                    scalingRatios={scalingRatios}
                />
            </div>

            <AttachmentDrawerPlus
                visible={isAttachmentDrawerVisible}
                updateToggle={attachmentDrawerUpdateToggle}
                onClose={onAttachmentDrawerClose}
                networdArgs={{type: "task", id: chromId, accessToken: accessToken}}
            />

        </div>
    );
}
