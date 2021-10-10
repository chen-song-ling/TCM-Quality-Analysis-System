import React, { useState, useEffect } from "react";
import "./MarkDashboard.css";

/* StateType
    markMode: 标记模式
        _: string {$
            none: 无
            key: 关键点模式
            fix: 定位点模式
        }
*/

/* Protocol
    uploadMarkMode()
    triggerUndoMark()
    triggerclearMark()
    triggerNumberMark()
    triggerSaveResult()
*/

export default function MarkDashboard(props) {
    const [markMode, setMarkMode] = useState("none"); 

    const config = {
        text_fixbtn_active: "正在标记定位点(红色)",
        text_fixbtn_fallow: "开始标记定位点(红色)",
        text_keybtn_active: "正在标记关键点(绿色)",
        text_keybtn_fallow: "开始标记关键点(绿色)",
        text_undobtn: "撤销标记",
        text_clearbtn: "清空标记",
        text_numberbtn: "开始标号",
        text_savebtn: "保存结果",
    }

    const handleFKBtnClick = (tag) => {
        let newone = "none";
        if (tag === "key") {
            if (markMode === "key") {
                newone = "none";
            } else {
                newone = "key";
            }
        } else if (tag === "fix") {
            if (markMode === "fix") {
                newone = "none";
            } else {
                newone = "fix";
            }
        }
        setMarkMode(newone);
        props.ptc_uploadMarkMode(newone);
    }

    const setFixBtnStyle = () => {
        if (markMode === "fix") {
            return "btn btn-danger";
        } else {
            return "btn btn-default";
        }
    }

    const setKeyBtnStyle = () => {
        if (markMode === "key") {
            return "btn btn-success";
        } else {
            return "btn btn-default";
        }
    }

    const setFixBtnText = () => {
        if (markMode === "fix") {
            return config.text_fixbtn_active;
        } else {
            return config.text_fixbtn_fallow;
        }
    }

    const setKeyBtnText = () => {
        if (markMode === "key") {
            return config.text_keybtn_active;
        } else {
            return config.text_keybtn_fallow;
        }
    }

    const handleUndoBtn = () => {
        props.ptc_triggerUndoMark();
    }

    const handleClearBtn = () => {
        props.ptc_triggerclearMark();
    }

    const handleNumberBtn = () => {
        props.ptc_triggerNumberMark();
    }

    const handleSaveBtn = () => {
        props.ptc_triggerSaveResult();
    }

    return (
        <div className="chmt-markdb">
            <div className="chmt-markdb-btnlist">
                <button type="button" className={setFixBtnStyle()} onClick={()=>handleFKBtnClick("fix")}>{setFixBtnText()}</button>
                <button type="button" className={setKeyBtnStyle()} onClick={()=>handleFKBtnClick("key")}>{setKeyBtnText()}</button>
            </div>
            <div className="chmt-markdb-btnlist">
                <button type="button" className="btn btn-default" onClick={handleUndoBtn}>{config.text_undobtn}</button>
                <button type="button" className="btn btn-default" onClick={handleClearBtn}>{config.text_clearbtn}</button>
                <button type="button" className="btn btn-default" onClick={handleNumberBtn}>{config.text_numberbtn}</button>
                <button type="button" className="btn btn-primary"  onClick={handleSaveBtn}>{config.text_savebtn}</button>
            </div>
        </div>
    );
}
