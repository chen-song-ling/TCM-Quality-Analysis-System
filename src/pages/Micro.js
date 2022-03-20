import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Micro.css';

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { Modal, notification, Space } from 'antd';
import { setMicroDate, setMicroTemperature, setMicroHumidity, setMicroStandard, setMicroManualResult, setMicroCheckList, setMicroImgGroup, setMicroImgAiInfo, setMicroStandardImgGroup } from '../slices/microSlice';
import { apiRunMicroTask, apiGetTask, apiUpdateTask, apiGetTaskReport } from '../util/api';
import MpHeader from '../components/MpHeader';
import CharacterInputBox from '../components/CharacterInputBox';
import CharacterImgList from '../components/CharacterImgList';
import PictureWall from '../components/PictureWall';
import AttachmentDrawerPlus from '../components/AttachmentDrawerPlus';
import AILoading from '../components/AILoading'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default function Micro(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const accessToken = useSelector(state => state.global.accessToken);
    const taskName = useSelector(state => state.global.taskName);

    const microId = useSelector(state => state.micro.microId);
    const dispatch = useDispatch();

    const microDate = useSelector(state => state.micro.microDate);
    const microTemperature = useSelector(state => state.micro.microTemperature);
    const microHumidity = useSelector(state => state.micro.microHumidity);
    const microStandard = useSelector(state => state.micro.microStandard);
    const microManualResult = useSelector(state => state.micro.microManualResult);
    const microCheckList = useSelector(state => state.micro.microCheckList);

    const microImgGroup = useSelector(state => state.micro.microImgGroup);
    const microStandardImgGroup = useSelector(state => state.micro.microStandardImgGroup);
    const microImgAiInfo = useSelector(state => state.micro.microImgAiInfo);

    const [isImgSelectorMoadlVisible, setIsImgSelectorMoadlVisible] = useState(false);
    const [fileList, setFileList] = useState([]);

    const [isAttachmentDrawerVisible, setIsAttachmentDrawerVisible] = useState(false);
    const [attachmentDrawerUpdateToggle, setAttachmentDrawerUpdateToggle] = useState(0);

    const [isReportBtnActive, setIsReportBtnActive] = useState(false);
    const [isSaveBtnActive, setIsSaveBtnActive] = useState(true);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const [cache, setCache] = useState(null);


    useEffect(() => {

        dispatch(setMicroDate(""));
        dispatch(setMicroTemperature(""));
        dispatch(setMicroHumidity(""));
        dispatch(setMicroStandard(""));
        dispatch(setMicroManualResult(""));
        dispatch(setMicroCheckList([true, true, true, true, true]));

        dispatch(setMicroImgGroup(null));
        dispatch(setMicroStandardImgGroup(null));
        dispatch(setMicroImgAiInfo(null));

        apiGetTask(accessToken, microId).then((res) => {

            setCache(res.data);

            dispatch(setMicroStandard(res.data.standard_desc));
            dispatch(setMicroManualResult(res.data.desc_manual));

            let newMicroCheckList = [true, true, true, true, true];
            res.data.additional_fields.forEach(item => {
                if (item.field_name === "日期") {
                    dispatch(setMicroDate(item.field_value));
                    newMicroCheckList[2] = item.is_included_in_report;
                } else if (item.field_name === "温度") {
                    dispatch(setMicroTemperature(item.field_value));
                    newMicroCheckList[3] = item.is_included_in_report;
                } else if (item.field_name === "湿度") {
                    dispatch(setMicroHumidity(item.field_value));
                    newMicroCheckList[4] = item.is_included_in_report;
                }

            });
            dispatch(setMicroCheckList(newMicroCheckList));

            if (res.data.result !== null) {
                setIsReportBtnActive(true);
                let newones_smp = [];
                let newones_std = [];
                let newones_info = [];
                res.data.result.results.forEach(item => {
                    newones_smp.push(item.origin_image.save_path);
                    newones_std.push(item.retrieval_image.save_path);
                    newones_info.push(`类别: ${item.category}\n置信度: ${item.score.toFixed(2)}`);
                });
                dispatch(setMicroImgGroup(newones_smp));
                dispatch(setMicroStandardImgGroup(newones_std));
                dispatch(setMicroImgAiInfo(newones_info));
            }

        }).catch((err) => {
            console.log(err);
        });

    }, []);

    useEffect(() => {
        if (microStandard === "" || microManualResult === "" || microDate === "" || microTemperature === "" || microHumidity == "") {
            setIsSaveBtnActive(false);
        } else {
            setIsSaveBtnActive(true);
        }
    }, [microStandard, microManualResult, microDate, microTemperature, microHumidity]);

    // -- BEGIN -- ProjectHeader相关

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

    // -- END -- ProjectHeader相关

    // -- BEGIN -- CharacterInputBox相关

    const onInputChange = (e, tag) => {
        switch (tag) {
            case "date":
                dispatch(setMicroDate(e.target.value));
                break;
            case "temperature":
                dispatch(setMicroTemperature(e.target.value));
                break;
            case "humidity":
                dispatch(setMicroHumidity(e.target.value));
                break;
            case "standard":
                dispatch(setMicroStandard(e.target.value));
                break;
            case "manualResult":
                dispatch(setMicroManualResult(e.target.value));
                break;
            default:
                break;
        }
    }

    const onSwitchClick = (checked, e, idx) => {
        let newones = [...microCheckList];
        newones[idx] = checked;
        dispatch(setMicroCheckList(newones));
    }

    const onSaveInfoClick = (e) => {

        if (microDate === "" || microTemperature === "" || microHumidity == "") {
            notification.open({
                message: "保存失败",
                description: "请输入所有必选项目。",
            });
        } else {

            apiGetTask(accessToken, microId).then((res) => {
                // console.log(res.data);
                let additionalFields = [];
                additionalFields.push({
                    field_name: "日期",
                    field_value: microDate,
                    is_included_in_report: microCheckList[2],
                    is_required: true,
                });
                additionalFields.push({
                    field_name: "温度",
                    field_value: microTemperature,
                    is_included_in_report: microCheckList[3],
                    is_required: true,
                });
                additionalFields.push({
                    field_name: "湿度",
                    field_value: microHumidity,
                    is_included_in_report: microCheckList[4],
                    is_required: true,
                });
                apiUpdateTask(accessToken, res.data.name, res.data.type, res.data.id, microStandard, microManualResult, additionalFields, res.data.attachments, res.data.result, res.data.sub_type).then((res) => {
                    notification.open({
                        message: "保存成功",
                    });
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
    }

    const onUploadSampleImgClick = (e) => {
        setIsImgSelectorMoadlVisible(true);
    }

    const onViewReportClick_discarded = (e) => {
        apiGetTaskReport(accessToken, microId).then((res) => {
            // console.log(res)
            ipcRenderer.send("view-file-online", res.data.save_path);
            setAttachmentDrawerUpdateToggle(attachmentDrawerUpdateToggle + 1);
        }).catch((err) => {
            console.log(err);
        });
    }

    const onViewReportClick = (e) => {

        let additionalFields = [];
        additionalFields.push({
            field_name: "日期",
            field_value: microDate,
            is_included_in_report: microCheckList[2],
            is_required: true,
        });
        additionalFields.push({
            field_name: "温度",
            field_value: microTemperature,
            is_included_in_report: microCheckList[3],
            is_required: true,
        });
        additionalFields.push({
            field_name: "湿度",
            field_value: microHumidity,
            is_included_in_report: microCheckList[4],
            is_required: true,
        });
        apiUpdateTask(accessToken, cache.name, cache.type, cache.id, microStandard, microManualResult, additionalFields, cache.attachments, cache.result, cache.sub_type).then((res) => {
            apiGetTaskReport(accessToken, microId).then((res) => {
                // console.log(res)
                ipcRenderer.send("view-file-online", res.data.save_path);
                setAttachmentDrawerUpdateToggle(attachmentDrawerUpdateToggle + 1);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            notification.open({
                message: "预览失败",
                description: "网络错误。",
            });
            console.log(err);
        });
        
    }

    const onExamineAttachmentClick = (e) => {
        setIsAttachmentDrawerVisible(true);
    }

    const onExamineStandardImgClick = (e) => {
        ipcRenderer.send("open-path", ["local", "micro", "standard"]);
    }

    // -- END -- CharacterInputBox相关

    // -- BDGIN -- ImgSelectorModal相关

    const dataurl2Blob = (dataurl) => {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataurl.split(',')[1]);

        // separate out the mime component
        var mimeString = dataurl.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], { type: mimeString });
        return blob;
    }

    const onImgSelectorModalOk = () => {
        let formData = new FormData();
        fileList.forEach(item => {
            formData.append('files', dataurl2Blob(item.thumbUrl), item.name);
        });
        setIsLoadingAI(true);

        dispatch(setMicroStandardImgGroup(null));
        apiRunMicroTask(accessToken, microId, formData).then((res) => {
            console.log(res);
            let newones_smp = [];
            let newones_std = [];
            let newones_info = [];
            res.data.result.results.forEach(item => {
                newones_smp.push(item.origin_image.save_path);
                newones_std.push(item.retrieval_image.save_path);
                newones_info.push(`类别: ${item.category}\n置信度: ${item.score.toFixed(2)}`);
            });
            dispatch(setMicroImgGroup(newones_smp));
            dispatch(setMicroStandardImgGroup(newones_std));
            dispatch(setMicroImgAiInfo(newones_info));

            setIsLoadingAI(false);
            setIsReportBtnActive(true);

        }).catch((err) => {
            console.log(err);
        });

        setIsImgSelectorMoadlVisible(false);
    }

    const onImgSelectorModalCancel = () => {
        setIsImgSelectorMoadlVisible(false);
    }

    const uploadFileList = (fileList) => {
        setFileList(fileList);
    }

    // -- END -- ImgSelectorModal相关

    // -- BEGIN -- AttachmentDrawer相关

    const onAttachmentDrawerClose = () => {
        setIsAttachmentDrawerVisible(false);
    }

    // -- END -- AttachmentDrawer相关

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <div className="mp-micro">

            <MpHeader
                onHeaderBackClick={onHeaderBackClick}
                onQuitClick={onQuitClick}
                onBreadClick={onBreadClick}
                username={username}
                breadItems={[
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

            <Space className="mp-vlist" direction="vertical" size={'middle'}>
                <CharacterInputBox
                    date={microDate}
                    temperature={microTemperature}
                    humidity={microHumidity}
                    standard={microStandard}
                    manualResult={microManualResult}
                    checkList={microCheckList}
                    isReportBtnActive={isReportBtnActive & isSaveBtnActive}
                    isSaveBtnActive={isSaveBtnActive}
                    onSaveInfoClick={onSaveInfoClick}
                    onInputChange={onInputChange}
                    onSwitchClick={onSwitchClick}
                    onUploadSampleImgClick={onUploadSampleImgClick}
                    onViewReportClick={onViewReportClick}
                    onExamineStandardImgClick={onExamineStandardImgClick}
                    onExamineAttachmentClick={onExamineAttachmentClick}
                />

                <AILoading
                    loading={isLoadingAI}
                />

            </Space>

            <CharacterImgList
                characterImgGroup={microImgGroup}
                characterStandardImgGroup={microStandardImgGroup}
                characterImgAiInfo={microImgAiInfo}
            />

            <AttachmentDrawerPlus
                visible={isAttachmentDrawerVisible}
                updateToggle={attachmentDrawerUpdateToggle}
                onClose={onAttachmentDrawerClose}
                networdArgs={{ type: "task", id: microId, accessToken: accessToken }}
            />

            <Modal title="上传要识别的所有图片" visible={isImgSelectorMoadlVisible} onOk={onImgSelectorModalOk} onCancel={onImgSelectorModalCancel}>
                <PictureWall
                    uploadFileList={uploadFileList}
                />
            </Modal>

        </div>
    );
};
