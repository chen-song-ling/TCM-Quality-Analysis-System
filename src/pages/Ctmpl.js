import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Project.css';

import { Layout, Menu, Button, Modal, Space, notification, Upload } from 'antd';
import { apiGetFunction, apiUpdateFunction, apiUpdateVariable, apiAddFunctionExcel, apiDeleteFunctionExcel } from '../util/api';
import MpHeader from '../components/MpHeader';
import CtmplTable from '../components/CtmplTable';
import EditableTable from '../components/EditableTable';
import CompoundInput from '../components/CompoundInput';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
import { baseStaticUrl } from '../util/const';

export default function Ctmpl(props) {

    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const accessToken = useSelector(state => state.global.accessToken);
    const dispatch = useDispatch();

    const ctmplId = useSelector(state => state.ctmpl.ctmplId);

    const [inputName, setInputName] = useState("");
    const [inputStandard, setInputStandard] = useState("");

    const [doesExcelExisted, setDoesExcelExisted] = useState(false);

    const [nextRowKey, setNextRowKey] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        apiGetFunction(accessToken, ctmplId).then((res) => {
            // console.log(res);
            setInputName(res.data.name);
            setInputStandard(res.data.standard_desc);

            if (res.data.variables !== null) {
                let newData = [];
                let key = nextRowKey;
                res.data.variables.forEach(item => {
                    newData.push({ ...item, id: key, key: key });
                    key += 1;
                });
                setData(newData);
                setNextRowKey(key);
                // console.log(newData);
            }

            if (res.data.excel_file !== null) {
                setDoesExcelExisted(true);
            }


        }).catch((err) => {
            console.log(err);
        });

        ipcRenderer.on("download-complete", (event, info) => {
            notification.open({
                message: "下载完成",
                description: info.filename + "下载完成。",
            });
        });

        return (() => {
            ipcRenderer.removeAllListeners("download-complete");
        });

    }, []);

    // -- BEGIN -- ProjectHeader相关

    const onHeaderBackClick = (e) => {
        setRedirect("/clist");
    }

    const onQuitClick = (e) => {
        setRedirect("/");
    }

    const onBreadClick = (e, tag) => {
        switch (tag) {
            case "clist":
                setRedirect("/clist");
                break;
            default:
                break;
        }
    }

    // -- END -- ProjectHeader相关

    // -- BEGIN -- Input相关

    const onInputChange = (e, tag) => {
        if (tag === "name") {
            setInputName(e.target.value);
        } else if (tag === "standard") {
            setInputStandard(e.target.value);
        }
    }

    const updateCalculationInfo = () => {
        if (inputName === "" || inputStandard === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
        } else {
            apiUpdateFunction(accessToken, inputName, inputStandard, ctmplId).then((res) => {

            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const addVariable = () => {
        let newData = [
            ...data,
            {
                "key": `${nextRowKey}`,
                "id": `${nextRowKey}`,
                "name": "",
                "unit": "",
                "symbol": "",
                "expression": "",
                "value": 0,
                "is_final_result": false,
                "is_included_in_report": false,
                "is_read_auto": false
            }
        ];
        setData(newData);
        setNextRowKey(nextRowKey + 1);
    }

    const saveVariable = () => {
        apiUpdateVariable(accessToken, data, ctmplId).then((res) => {
            // console.log(res);
            notification.open({
                message: "保存成功",
            });
        }).catch((err) => {
            console.log(err);
            notification.open({
                message: "保存失败",
                // description: "请补充完整所有必填信息",
            });
        });
    }

    const customRequest = (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        let formData = new FormData();
        formData.append('file', file);

        apiAddFunctionExcel(accessToken, ctmplId, formData).then((res) => {
            // console.log(res);
            setDoesExcelExisted(true);

        }).catch((err) => {
            console.log(err);
        });
    }

    const deleteExcel = () => {
        apiDeleteFunctionExcel(accessToken, ctmplId).then((res) => {
            setDoesExcelExisted(false);
        }).catch((err) => {
            console.log(err);
        });
    }

    const downloadExcel = () => {
        apiGetFunction(accessToken, ctmplId).then((res) => {
            ipcRenderer.send("download", {
                url: baseStaticUrl + res.data.excel_file.save_path,
                properties: {
                    saveAs: true,
                    filename: inputName + res.data.excel_file.file_ext,
                },
                uuid: res.data.excel_file.uuid,
                filename: inputName + res.data.excel_file.file_ext,
            });


        }).catch((err) => {
            console.log(err);
        });
    }

    // -- END -- Input相关

    // -- BEGIN -- CtmplTable相关

    const onDeleteClick = (record) => {

    }

    const uploadData = (newData) => {
        setData(newData);
    }

    // -- END -- CtmplTable相关

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    return (
        <div>
            <MpHeader
                onHeaderBackClick={onHeaderBackClick}
                onQuitClick={onQuitClick}
                onBreadClick={onBreadClick}
                username={username}
                breadItems={[
                    {
                        text: "计算模版管理",
                        isActive: true,
                        funcTag: "clist",
                    },
                    {
                        text: "模版编辑",
                        isActive: false,
                    },
                ]}
            />

            <Space
                className="mp-vlist"
                direction="vertical"
                size={'small'}
                style={{ marginTop: 30 }}
            >
                <CompoundInput
                    isSwitchHidden={true}
                    fieldName="模版名称"
                    text={inputName}
                    isRequired={true}
                    textWidth={200}
                    maxLength={30}

                    onInputChange={(e) => onInputChange(e, "name")}
                />

                <CompoundInput
                    isSwitchHidden={true}
                    fieldName="标准规定"
                    text={inputStandard}
                    isRequired={true}
                    textWidth={200}
                    maxLength={30}

                    onInputChange={(e) => onInputChange(e, "standard")}
                />


                <Button type="primary" size={'large'} onClick={updateCalculationInfo} style={{ marginBottom: 40 }}>
                    修改信息
                </Button>

            </Space>

            <CtmplTable
                onDeleteClick={onDeleteClick}
                data={data}
                loading={loading}

                ptc_uploadData={uploadData}
            />

            <div
                className="mp-vlist"
                style={{ marginTop: 30 }}
            >

                <Space size={'large'}>

                    <Button type="primary" size={'large'} onClick={addVariable}>
                        新增变量
                    </Button>

                    <Button size={'large'} onClick={saveVariable}>
                        保存变量
                    </Button>

                    <Upload
                        accept="*"
                        listType="picture"
                        fileList={[]}
                        customRequest={customRequest}
                    >
                        <Button size={'large'}>上传Excel计算表</Button>
                    </Upload>

                    <Button size={'large'} onClick={deleteExcel} disabled={!doesExcelExisted}>
                        删除Excel计算表
                    </Button>

                    <Button size={'large'} onClick={downloadExcel} disabled={!doesExcelExisted}>
                        下载Excel计算表
                    </Button>

                </Space>
            </div>

        </div>
    )
}
