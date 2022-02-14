import React, { useState, useEffect } from "react";
import MarkBlock from "./MarkBlock";
import "./MarkCntr.css";
import MarkDashboard from "./MarkDashboard";



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
    const [markMode, setMarkMode] = useState("none");

    const [undoMark, doUndoMark] = useState(0);
    const [clearMark, doClearMark] = useState(0);
    const [numberMark, doNumberMark] = useState(0);

    //-- Protocol Begin

    const uploadMarkMode = (newMarkMode) => {
        setMarkMode(newMarkMode);
    }

    const uploadMarkedPoints = (newMarkedPoints) => {
        props.ptc_uploadMarkedPoints(newMarkedPoints);
    }

    const uploadScalingRatios = (newScalingRatios) => {
        props.ptc_uploadScalingRatios(newScalingRatios);
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

    //-- Protocol End

    return (
        <div className="chmt-markcntr">
            <MarkBlock 

                ptc_uploadMarkedPoints={uploadMarkedPoints}
                ptc_uploadScalingRatios={uploadScalingRatios}
                ptc_uploadMBSnapshootData={uploadMBSnapshootData}

                cropImgList={props.cropImgList}
                cropBoxSizeList={props.cropBoxSizeList}

                markedPoints={props.markedPoints}
                scalingRatios={props.scalingRatios}

                markMode={markMode}
                undoMark={undoMark}
                clearMark={clearMark}
                numberMark={numberMark}
            />
            <MarkDashboard 
                ptc_uploadMarkMode={uploadMarkMode}
                ptc_triggerUndoMark={triggerUndoMark}
                ptc_triggerclearMark={triggerclearMark}
                ptc_triggerNumberMark={triggerNumberMark}
                ptc_triggerSaveResult={triggerSaveResult}
                ptc_triggerShowAttachment={triggerShowAttachment}
            />
        </div>
    );
}
