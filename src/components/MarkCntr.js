import React, { useState, useEffect } from "react";
import MarkBlock from "./MarkBlock";
import "./MarkCntr.css";
import MarkDashboard from "./MarkDashboard";
import ColorPicker from "./ColorPicker";


/* StateType
    markMode: 标记模式
        _: string {$
            none: 无
            key: 关键点模式
            fix: 定位点模式
        }
*/

/* Protocol
    triggerSaveResult()
    uploadMarkedPoints()
    uploadScalingRatios()
*/

export default function MarkCntr(props) {
    // const [markMode, setMarkMode] = useState("none");

    const [undoMark, doUndoMark] = useState(0);
    const [clearMark, doClearMark] = useState(0);
    const [numberMark, doNumberMark] = useState(0);

    //-- Protocol Begin

    const uploadMarkMode = (newMarkMode) => {
        // setMarkMode(newMarkMode);
        props.ptc_uploadMarkMode(newMarkMode);
    }

    const uploadMarkedPoints = (newMarkedPoints) => {
        props.ptc_uploadMarkedPoints(newMarkedPoints);
    }

    const uploadScalingRatios = (newScalingRatios) => {
        props.ptc_uploadScalingRatios(newScalingRatios);
    }

    const uploadFocusedCv = (newFocusedCv) => {
        props.ptc_uploadFocusedCv(newFocusedCv);
    }

    // 上传 MarkBlock 的快照数据
    const uploadMBSnapshootData = (newMBSnapshootData) => {
        console.log(newMBSnapshootData)
    }

    const triggerUndoMark = () => {
        doUndoMark(undoMark+1);
    }

    const triggerclearMark = () => {
        doClearMark(clearMark+1);
    }

    const triggerNumberMark = () => {
        doNumberMark(numberMark+1);
    }

    const triggerSaveResult = () => {
        props.ptc_triggerSaveResult();
    }

    const triggerShowAttachment = () => {
        props.ptc_triggerShowAttachment();
    }

    const triggerUploadResult = () => {
        props.ptc_triggerUploadResult();
    }

    const triggerPickColor = () => {
        props.ptc_triggerPickColor();
    }

    // const uploadDrawPointToPreciseCanvas = (newPrecDrawInfo) => {
    //     props.ptc_uploadDrawPointToPreciseCanvas(newPrecDrawInfo);
    // }

    //-- Protocol End

    return (
        <div className="chmt-markcntr">
            <MarkBlock 

                ptc_uploadMarkedPoints={uploadMarkedPoints}
                ptc_uploadScalingRatios={uploadScalingRatios}
                ptc_uploadMBSnapshootData={uploadMBSnapshootData}
                ptc_uploadFocusedCv={uploadFocusedCv}
                ptc_uploadDrawPointToPreciseCanvas={props.ptc_uploadDrawPointToPreciseCanvas}

                cropImgList={props.cropImgList}
                cropBoxSizeList={props.cropBoxSizeList}

                markedPoints={props.markedPoints}
                scalingRatios={props.scalingRatios}
                markMode={props.markMode}
                focusedCv={props.focusedCv}

                undoMark={undoMark}
                clearMark={clearMark}
                numberMark={numberMark}

                standardDrawInfo={props.standardDrawInfo}
            />
            <MarkDashboard 
                ptc_uploadMarkMode={uploadMarkMode}
                ptc_triggerUndoMark={triggerUndoMark}
                ptc_triggerclearMark={triggerclearMark}
                ptc_triggerNumberMark={triggerNumberMark}
                ptc_triggerSaveResult={triggerSaveResult}
                ptc_triggerUploadResult={triggerUploadResult}
                ptc_triggerShowAttachment={triggerShowAttachment}
                ptc_triggerPickColor={triggerPickColor}

                cropImgList={props.cropImgList}
                focusedCv={props.focusedCv}
                markedPoints={props.markedPoints}
            />
            <ColorPicker
                isColorPickerModalVisible={props.isColorPickerModalVisible}
                ptc_uploadIsColorPickerModalVisible={props.ptc_uploadIsColorPickerModalVisible}

                cropImgList={props.cropImgList}
                focusedCv={props.focusedCv}
                cropBoxSizeList={props.cropBoxSizeList}
            />
        </div>
    );
}
