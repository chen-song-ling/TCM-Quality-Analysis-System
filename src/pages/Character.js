import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Character.css';

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { Modal, notification } from 'antd';
import { setLastCharacterId, setCharacterDate, setCharacterTemperature, setCharacterHumidity, setCharacterStandard, setCharacterManualResult, setCharacterCheckList, setCharacterSampleImg, setCharacterImgGroup, setCharacterImgAiInfo } from '../slices/characterSlice';
import CharacterHeader from '../components/CharacterHeader';
import CharacterInputBox from '../components/CharacterInputBox';
import CharacterImgList from '../components/CharacterImgList';

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
    const characterImgAiInfo = useSelector(state => state.character.characterImgAiInfo);

    const username = useSelector(state => state.global.username);
    const dispatch = useDispatch();

    const [cropper, setCropper] = useState();
    const [isCroplMoadlVisible, setIsCroplMoadlVisible] = useState(false);

    useEffect(() => {
        // 使用缓存
        if (characterId === lastCharacterId) {

        } else {
            dispatch(setCharacterDate(""));
            dispatch(setCharacterTemperature(""));
            dispatch(setCharacterHumidity(""));
            dispatch(setCharacterStandard(""));
            dispatch(setCharacterManualResult(""));
            dispatch(setCharacterCheckList([true, true, true, true, true]));

            dispatch(setCharacterSampleImg({
                sampleImg: null,
                sampleImgName: "",
                cropSize: null,
            }));
            dispatch(setCharacterImgGroup(null));
            dispatch(setCharacterImgAiInfo(null));
            
        }
        
    }, []);

    useEffect(() => {
        return () => {
            dispatch(setLastCharacterId(characterId));
        }
    });

    // -- BEGIN -- ProjectHeader相关

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
        ele.click();
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
        };
        reader.readAsDataURL(files[0]);
    }

    const onExamineStandardImgClick = (e) => {
        ipcRenderer.send("open-path", ["local", "character", "standard"]);
    }

    const onExamineAttachmentClick = (e) => {
        ipcRenderer.send("open-pdf", ["local", "attachment", "att1.pdf"]);
    }

    // -- END -- CharacterInputBox相关

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

    var crop = function(canvas, offsetX, offsetY, width, height, callback) {
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

    const onCropModalOk = () => {
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
            // console.log(newones);
            dispatch(setCharacterImgGroup(newones));
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
        <div className="mp-project">
            <CharacterHeader
                username={username}
                onQuitClick={onQuitClick}
                onBreadClick={onBreadClick}
            />
            <CharacterInputBox
                date={characterDate}
                temperature={characterTemperature}
                humidity={characterHumidity}
                standard={characterStandard}
                manualResult={characterManualResult}
                checkList={characterCheckList}
                onInputChange={onInputChange}
                onSwitchClick={onSwitchClick}
                onUploadSampleImgClick={onUploadSampleImgClick}
                onExamineStandardImgClick={onExamineStandardImgClick}
                onExamineAttachmentClick={onExamineAttachmentClick}
            />

            <CharacterImgList
                characterImgGroup={characterImgGroup}
                characterImgAiInfo={characterImgAiInfo}
                cropBoxSize={characterSampleImg.cropSize}
            />

            <input type="file" id="the-ghost-uploadSampleImg" style={{display: "none"}} onChange={onSampleImgChange} /> 

            <Modal className="mp-character-modal" title="AI 识别" visible={isCroplMoadlVisible} onOk={onCropModalOk} onCancel={onCropModalCancel}>
                <Cropper
                    style={{ height: 400, width: "100%" }}
                    zoomable={false}
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