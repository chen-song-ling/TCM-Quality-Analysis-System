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
    triggerShowAttachment()
*/

export default function MarkDashboard(props) {
    const [markMode, setMarkMode] = useState("none"); 

    const config = {
        text_fixbtn_active: "标记定位斑点(红色)",
        text_fixbtn_fallow: "标记定位斑点(红色)",
        text_keybtn_active: "标记鉴别斑点(绿色)",
        text_keybtn_fallow: "标记鉴别斑点(绿色)",
        text_oribtn_active: "标记原点(黄色)",
        text_oribtn_fallow: "标记原点(黄色)",
        text_escbtn_fallow: "标记逃逸点(橙色)",
        text_escbtn_active: "标记逃逸点(橙色)",
        text_undobtn: "撤销标记",
        text_clearbtn: "清空标记",
        text_numberbtn: "开始标号",
        text_savebtn: "导出结果",
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
        } else if (tag === "ori") {
            if (markMode === "ori") {
                newone = "none";
            } else {
                newone = "ori";
            }
        } else if (tag === "esc") {
            if (markMode === "esc") {
                newone = "none";
            } else {
                newone = "esc";
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

    const setOriBtnStyle = () => {
        if (markMode === "ori") {
            return "btn btn-warning";
        } else {
            return "btn btn-default";
        }
    }

    const setEscBtnStyle = () => {
        if (markMode === "esc") {
            return "btn btn-esc";
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

    const setOriBtnText = () => {
        if (markMode === "ori") {
            return config.text_oribtn_active;
        } else {
            return config.text_oribtn_fallow;
        }
    } 

    const setEscBtnText = () => {
        if (markMode === "esc") {
            return config.text_escbtn_active;
        } else {
            return config.text_escbtn_fallow;
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

    const handleUploadBtn = () => {
        props.ptc_triggerUploadResult();
    }

    const handleReportBtn = () => {
        console.log("handleReportBtn");
    }

    const handleAttachmentBtn = () => {
        props.ptc_triggerShowAttachment();
    }

    const handlePickColorBtn = () => {
        props.ptc_triggerPickColor();
    }

    return (
        <div className="chmt-markdb">
            <div className="chmt-markdb-btnlist">
                <button type="button" className={setFixBtnStyle()} onClick={()=>handleFKBtnClick("fix")}>{setFixBtnText()}</button>
                <button type="button" className={setKeyBtnStyle()} onClick={()=>handleFKBtnClick("key")}>{setKeyBtnText()}</button>
                <button type="button" className={setOriBtnStyle()} onClick={()=>handleFKBtnClick("ori")}>{setOriBtnText()}</button>
                <button type="button" className={setEscBtnStyle()} onClick={()=>handleFKBtnClick("esc")}>{setEscBtnText()}</button>
                <button type="button" className="btn btn-primary"  onClick={handleUploadBtn}>{"保存"}</button>
            </div>
            <div className="chmt-markdb-btnlist">
                <button type="button" className="btn btn-default" onClick={handleUndoBtn}>{config.text_undobtn}</button>
                <button type="button" className="btn btn-default" onClick={handleClearBtn}>{config.text_clearbtn}</button>
                <button type="button" className="btn btn-default" onClick={handleNumberBtn}>{config.text_numberbtn}</button>
                <button type="button" className="btn btn-default" onClick={handlePickColorBtn} disabled={props.focusedCv < 0 | props.focusedCv >= props.cropImgList.length}>{"取色"}</button>
                <button type="button" className="btn btn-default" disabled="disabled" onClick={handleReportBtn}>{"预览报告"}</button>
                <button type="button" className="btn btn-primary"  onClick={handleSaveBtn}>{config.text_savebtn}</button>
                <button type="button" className="btn btn-default" onClick={handleAttachmentBtn}>{"附件管理"}</button>
            </div>
        </div>
    );
}
