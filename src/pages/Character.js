import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Character.css';

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { Button, Upload, Modal, notification, Space } from 'antd';
import { setLastCharacterId, setCharacterDate, setCharacterTemperature, setCharacterHumidity, setCharacterStandard, setCharacterManualResult, setCharacterCheckList, setCharacterSampleImg, setCharacterImgGroup, setCharacterImgAiInfo, setCharacterStandardImgGroup } from '../slices/characterSlice';
import { apiRunCharacterTask, apiGetTask, apiUpdateTask, apiGetTaskReport } from '../util/api';
import MpHeader from '../components/MpHeader';
import CharacterInputBox from '../components/CharacterInputBox';
import CharacterImgList from '../components/CharacterImgList';
import AttachmentDrawer from '../components/AttachmentDrawer';
import AttachmentDrawerPlus from '../components/AttachmentDrawerPlus';
import AILoading from '../components/AILoading';
import { baseStaticUrl } from '../util/const';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;


export default function Character(props) {
    const [redirect, setRedirect] = useState(null);
    const characterId = useSelector(state => state.character.characterId);
    const lastCharacterId = useSelector(state => state.character.lastCharacterId);
    const characterDate = useSelector(state => state.character.characterDate);
    const characterTemperature = useSelector(state => state.character.characterTemperature);
    const characterHumidity = useSelector(state => state.character.characterHumidity);
    const characterStandard = useSelector(state => state.character.characterStandard);
    const characterManualResult = useSelector(state => state.character.characterManualResult);
    const characterCheckList = useSelector(state => state.character.characterCheckList);

    const characterSampleImg = useSelector(state => state.character.characterSampleImg);
    const characterImgGroup = useSelector(state => state.character.characterImgGroup);
    const characterStandardImgGroup = useSelector(state => state.character.characterStandardImgGroup);
    const characterImgAiInfo = useSelector(state => state.character.characterImgAiInfo);

    const username = useSelector(state => state.global.username);
    const accessToken = useSelector(state => state.global.accessToken);
    const taskName = useSelector(state => state.global.taskName);
    const dispatch = useDispatch();

    const [characterOriginalImgUrl, setCharacterOriginalImgUrl] = useState(null);

    const [cropper, setCropper] = useState();
    const [isCroplMoadlVisible, setIsCroplMoadlVisible] = useState(false);
    const [isAttachmentDrawerVisible, setIsAttachmentDrawerVisible] = useState(false);
    const [attachmentDrawerUpdateToggle, setAttachmentDrawerUpdateToggle] = useState(0);

    const [isReportBtnActive, setIsReportBtnActive] = useState(false);
    const [isSaveBtnActive, setIsSaveBtnActive] = useState(true);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const [cache, setCache] = useState(null);


    useEffect(() => {

        dispatch(setCharacterDate(""));
        dispatch(setCharacterTemperature(""));
        dispatch(setCharacterHumidity(""));
        dispatch(setCharacterStandard(""));
        dispatch(setCharacterManualResult(""));
        dispatch(setCharacterCheckList([true, true, true, true, true]));

        dispatch(setCharacterImgGroup(null));
        dispatch(setCharacterStandardImgGroup(null));
        dispatch(setCharacterImgAiInfo(null));

        apiGetTask(accessToken, characterId).then((res) => {

            // console.log(res.data);
            setCache(res.data);

            dispatch(setCharacterStandard(res.data.standard_desc));
            dispatch(setCharacterManualResult(res.data.desc_manual));

            let newCharacterCheckList = [true, true, true, true, true];
            res.data.additional_fields.forEach(item => {
                if (item.field_name === "日期") {
                    dispatch(setCharacterDate(item.field_value));
                    newCharacterCheckList[2] = item.is_included_in_report;
                } else if (item.field_name === "温度") {
                    dispatch(setCharacterTemperature(item.field_value));
                    newCharacterCheckList[3] = item.is_included_in_report;
                } else if (item.field_name === "湿度") {
                    dispatch(setCharacterHumidity(item.field_value));
                    newCharacterCheckList[4] = item.is_included_in_report;
                }
            });
            dispatch(setCharacterCheckList(newCharacterCheckList));

            if (res.data.result !== null) {
                setIsReportBtnActive(true);
                setCharacterOriginalImgUrl(baseStaticUrl + res.data.result.uploaded_images[0].save_path)

                let newones_smp = [];
                let newones_std = [];
                let newones_info = [];
                res.data.result.results.forEach(item => {
                    newones_smp.push(item.origin_image.save_path);
                    newones_std.push(item.retrieval_image.save_path);
                    newones_info.push(`类别: ${item.category}\n置信度: ${item.score.toFixed(2)}`);
                });
                dispatch(setCharacterImgGroup(newones_smp));
                dispatch(setCharacterStandardImgGroup(newones_std));
                dispatch(setCharacterImgAiInfo(newones_info));
            }


        }).catch((err) => {
            console.log(err);
        });


    }, []);

    useEffect(() => {
        // return () => {
        //     dispatch(setLastCharacterId(characterId));
        // }
    });


    useEffect(() => {
        if (characterStandard === "" || characterManualResult === "" || characterDate === "" || characterTemperature === "" || characterHumidity == "") {
            setIsSaveBtnActive(false);
        } else {
            setIsSaveBtnActive(true);
        }
    }, [characterStandard, characterManualResult, characterDate, characterTemperature, characterHumidity]);

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
                dispatch(setCharacterDate(e.target.value));
                break;
            case "temperature":
                dispatch(setCharacterTemperature(e.target.value));
                break;
            case "humidity":
                dispatch(setCharacterHumidity(e.target.value));
                break;
            case "standard":
                dispatch(setCharacterStandard(e.target.value));
                break;
            case "manualResult":
                dispatch(setCharacterManualResult(e.target.value));
                break;
            default:
                break;
        }
    }

    const onSwitchClick = (checked, e, idx) => {
        let newones = [...characterCheckList];
        newones[idx] = checked;
        dispatch(setCharacterCheckList(newones));
    }

    const onUploadSampleImgClick = (e) => {
        let ele = document.getElementById("the-ghost-uploadSampleImg");
        console.log(ele);
        ele.click();
    }

    const onViewReportClick_discarded = (e) => {
        apiGetTaskReport(accessToken, characterId).then((res) => {
            // console.log(res)
            ipcRenderer.send("view-file-online", res.data.save_path);
            setAttachmentDrawerUpdateToggle(attachmentDrawerUpdateToggle + 1);
        }).catch((err) => {
            console.log(err);
        });
    }

    const onViewReportClick_discarded2 = (e) => {

        apiGetTask(accessToken, characterId).then((res) => {
            // console.log(res.data);
            let additionalFields = [];
            additionalFields.push({
                field_name: "日期",
                field_value: characterDate,
                is_included_in_report: characterCheckList[2],
                is_required: true,
            });
            additionalFields.push({
                field_name: "温度",
                field_value: characterTemperature,
                is_included_in_report: characterCheckList[3],
                is_required: true,
            });
            additionalFields.push({
                field_name: "湿度",
                field_value: characterHumidity,
                is_included_in_report: characterCheckList[4],
                is_required: true,
            });
            apiUpdateTask(accessToken, res.data.name, res.data.type, res.data.id, characterStandard, characterManualResult, additionalFields, res.data.attachments, res.data.result, res.data.sub_type).then((res) => {
                apiGetTaskReport(accessToken, characterId).then((res) => {
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

        }).catch((err) => {
            console.log(err);
        });
    }

    const onViewReportClick = (e) => {

        // console.log(res.data);
        let additionalFields = [];
        additionalFields.push({
            field_name: "日期",
            field_value: characterDate,
            is_included_in_report: characterCheckList[2],
            is_required: true,
        });
        additionalFields.push({
            field_name: "温度",
            field_value: characterTemperature,
            is_included_in_report: characterCheckList[3],
            is_required: true,
        });
        additionalFields.push({
            field_name: "湿度",
            field_value: characterHumidity,
            is_included_in_report: characterCheckList[4],
            is_required: true,
        });
        apiUpdateTask(accessToken, cache.name, cache.type, cache.id, characterStandard, characterManualResult, additionalFields, cache.attachments, cache.result, cache.sub_type).then((res) => {
            apiGetTaskReport(accessToken, characterId).then((res) => {
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

    const onSaveInfoClick = (e) => {
        // console.log(originalTaskData);
        // apiUpdateTask(accessToken, editReordInput, taskTypeDicString2Number[editReord.taskType], editReord.id, editReord.standardDesc, editReord.manualDesc, editReord.additionalFields, editReord.attachments, editReord.result, editReord.subType).then((res) => {
        //     // console.log(res);

        // }).catch((err) => {
        //     console.log(err);
        // });

        if (characterDate === "" || characterTemperature === "" || characterHumidity == "") {
            notification.open({
                message: "保存失败",
                description: "请输入所有必选项目。",
            });
        } else {

            apiGetTask(accessToken, characterId).then((res) => {
                // console.log(res.data);
                let additionalFields = [];
                additionalFields.push({
                    field_name: "日期",
                    field_value: characterDate,
                    is_included_in_report: characterCheckList[2],
                    is_required: true,
                });
                additionalFields.push({
                    field_name: "温度",
                    field_value: characterTemperature,
                    is_included_in_report: characterCheckList[3],
                    is_required: true,
                });
                additionalFields.push({
                    field_name: "湿度",
                    field_value: characterHumidity,
                    is_included_in_report: characterCheckList[4],
                    is_required: true,
                });
                apiUpdateTask(accessToken, res.data.name, res.data.type, res.data.id, characterStandard, characterManualResult, additionalFields, res.data.attachments, res.data.result, res.data.sub_type).then((res) => {
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

    const onSampleImgChange = (e) => {
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            dispatch(setCharacterSampleImg({
                ...characterSampleImg,
                sampleImg: reader.result,
                sampleImgName: files[0].name,
            }))
            setIsCroplMoadlVisible(true);
            let ele = document.getElementById("the-ghost-uploadSampleImg");
            ele.value = "";
        };
        reader.readAsDataURL(files[0]);
    }

    const customRequest = (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const reader = new FileReader();
        reader.onload = () => {
            dispatch(setCharacterSampleImg({
                ...characterSampleImg,
                sampleImg: reader.result,
                sampleImgName: file.name,
            }))
            setIsCroplMoadlVisible(true);
        };
        reader.readAsDataURL(file);
    }

    const onExamineStandardImgClick = (e) => {
        ipcRenderer.send("open-path", ["local", "character", "standard"]);
    }

    const onExamineAttachmentClick = (e) => {
        // ipcRenderer.send("open-pdf", ["local", "attachment", "att1.pdf"]);
        // setUpdateAttachmentToggle(updateAttachmentToggle+1);
        setIsAttachmentDrawerVisible(true);
    }

    // -- END -- CharacterInputBox相关

    // -- BEGIN -- AttachmentDrawer相关

    const onAttachmentDrawerClose = () => {
        setIsAttachmentDrawerVisible(false);
    }

    // -- END -- AttachmentDrawer相关

    // -- BEGIN -- Crop Modal相关

    const onCropModalOk_discarded = () => {
        if (typeof cropper !== "undefined") {
            let canvas = cropper.getCroppedCanvas();
            let w = canvas.width;
            let h = canvas.height;
            dispatch(setCharacterSampleImg({
                ...characterSampleImg,
                cropSize: {
                    width: w,
                    height: h,
                }
            }));
            let ctx = canvas.getContext("2d");
            console.log(ctx);
            let newones = [];
            for (let i = 0; i < 9; i++) {
                let r = Math.floor(i / 3);
                let c = i % 3;
                newones.push(ctx.getImageData(r * h / 3, c * w / 3, w / 3, h / 3));
            }
            console.log(newones);
            dispatch(setCharacterImgGroup(newones));
        }

        setIsCroplMoadlVisible(false);
    }

    var crop = function (canvas, offsetX, offsetY, width, height, callback) {
        // create an in-memory canvas
        var buffer = document.createElement('canvas');
        var b_ctx = buffer.getContext('2d');
        // set its width/height to the required ones
        buffer.width = width;
        buffer.height = height;
        // draw the main canvas on our buffer one
        // drawImage(source, source_X, source_Y, source_Width, source_Height, 
        //  dest_X, dest_Y, dest_Width, dest_Height)
        b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
            0, 0, buffer.width, buffer.height);
        // now call the callback with the dataURL of our buffer canvas
        callback(buffer.toDataURL());
    };

    const onCropModalOk_discarded2 = () => {
        if (typeof cropper !== "undefined") {
            let canvas = cropper.getCroppedCanvas();
            let w = canvas.width;
            let h = canvas.height;
            dispatch(setCharacterSampleImg({
                ...characterSampleImg,
                cropSize: {
                    width: w,
                    height: h,
                }
            }));
            let newones = ["", "", "", "", "", "", "", "", ""];
            for (let i = 0; i < 9; i++) {
                let r = Math.floor(i / 3);
                let c = i % 3;
                crop(canvas, c * w / 3, r * h / 3, w / 3, h / 3, (res) => {
                    newones[i] = res;
                })
            }
            console.log(newones);
            dispatch(setCharacterImgGroup(newones));
        }

        setIsCroplMoadlVisible(false);
    }

    const onCropModalOk = () => {
        if (typeof cropper !== "undefined") {
            let canvas = cropper.getCroppedCanvas();
            let w = canvas.width;
            let h = canvas.height;
            // dispatch(setCharacterSampleImg({
            //     ...characterSampleImg,
            //     cropSize: {
            //         width: w,
            //         height: h,
            //     }
            // }));
            canvas.toBlob((blob) => {
                let formData = new FormData();
                formData.append('files', blob, 'blob.png');
                setIsLoadingAI(true);

                dispatch(setCharacterStandardImgGroup(null));
                apiRunCharacterTask(accessToken, characterId, formData).then((res) => {
                    // console.log(res);
                    let newones_smp = [];
                    let newones_std = [];
                    let newones_info = [];
                    res.data.result.results.forEach(item => {
                        newones_smp.push(item.origin_image.save_path);
                        newones_std.push(item.retrieval_image.save_path);
                        // newones_info.push(item.score);
                        newones_info.push(`类别: ${item.category}\n置信度: ${item.score.toFixed(2)}`);
                    });
                    dispatch(setCharacterImgGroup(newones_smp));
                    dispatch(setCharacterStandardImgGroup(newones_std));
                    dispatch(setCharacterImgAiInfo(newones_info));

                    setIsLoadingAI(false);
                    setIsReportBtnActive(true);
                }).catch((err) => {
                    console.log(err);
                });
            });

        }

        setIsCroplMoadlVisible(false);
    }

    const onCropModalCancel = () => {
        setIsCroplMoadlVisible(false);
    }

    // -- END -- Crop Modal相关


    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <div className="mp-character">
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
                    date={characterDate}
                    temperature={characterTemperature}
                    humidity={characterHumidity}
                    standard={characterStandard}
                    manualResult={characterManualResult}
                    checkList={characterCheckList}
                    isReportBtnActive={isReportBtnActive & isSaveBtnActive}
                    isSaveBtnActive={isSaveBtnActive}
                    onSaveInfoClick={onSaveInfoClick}
                    onInputChange={onInputChange}
                    onSwitchClick={onSwitchClick}
                    onUploadSampleImgClick={onUploadSampleImgClick}
                    onExamineStandardImgClick={onExamineStandardImgClick}
                    onExamineAttachmentClick={onExamineAttachmentClick}
                    onViewReportClick={onViewReportClick}
                />


                <AILoading
                    loading={isLoadingAI}
                />

            </Space>

            <CharacterImgList
                originalImg={characterOriginalImgUrl}
                characterImgGroup={characterImgGroup}
                characterStandardImgGroup={characterStandardImgGroup}
                characterImgAiInfo={characterImgAiInfo}
            // cropBoxSize={characterSampleImg.cropSize}
            />

            {/* <input type="file" id="the-ghost-uploadSampleImg" style={{ display: "none" }} onChange={onSampleImgChange} /> */}

            <Upload
                accept="image/*"
                listType="picture"
                fileList={[]}
                customRequest={customRequest}
            >
                <Button id="the-ghost-uploadSampleImg"></Button>
            </Upload>

            {/* <AttachmentDrawer
                visible={isAttachmentDrawerVisible}
                onClose={onAttachmentDrawerClose}
                updateToggle={updateAttachmentToggle}
            /> */}

            <AttachmentDrawerPlus
                visible={isAttachmentDrawerVisible}
                updateToggle={attachmentDrawerUpdateToggle}
                onClose={onAttachmentDrawerClose}
                networdArgs={{ type: "task", id: characterId, accessToken: accessToken }}
            />


            <Modal className="mp-character-modal" title="AI 识别" visible={isCroplMoadlVisible} onOk={onCropModalOk} onCancel={onCropModalCancel}>
                <Cropper
                    style={{ height: 400, width: "100%" }}
                    zoomable={false}
                    modal={false}
                    highlight={false}
                    zoomTo={0.5} //
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={characterSampleImg.sampleImg}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    guides={true}
                />
            </Modal>

        </div>
    );
}