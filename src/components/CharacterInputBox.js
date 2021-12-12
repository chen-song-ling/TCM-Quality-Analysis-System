import React from 'react';
import './CharacterInputBox.css';
import { Input, Space, Switch, Button } from 'antd';
import CompoundInput from './CompoundInput';

export default function CharacterInputBox(props) {

    var isReportBtnActive = false;
    if (props.isReportBtnActive !== undefined) {
        isReportBtnActive = props.isReportBtnActive;
    }

    var isSaveBtnActive = true;
    if (props.isSaveBtnActive !== undefined) {
        isSaveBtnActive = props.isSaveBtnActive;
    }

    const config = {
        textWidth: 500,
    }

    return (
        <div className="mp-charinbox mp-vlist">
            <Space className="mp-vlist" direction="vertical" size={'middle'}>

                <CompoundInput
                    checked={props.checkList[0]}
                    fieldName="标准规定"
                    text={props.standard}
                    maxLength={1000}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={true}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 0)}
                    onInputChange={(e) => props.onInputChange(e, "standard")}
                />

                <CompoundInput
                    checked={props.checkList[1]}
                    fieldName="人工鉴别"
                    text={props.manualResult}
                    maxLength={1000}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={true}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 1)}
                    onInputChange={(e) => props.onInputChange(e, "manualResult")}
                />

                <CompoundInput
                    checked={props.checkList[2]}
                    fieldName="日期"
                    text={props.date}
                    maxLength={100}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={false}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 2)}
                    onInputChange={(e) => props.onInputChange(e, "date")}
                />

                <CompoundInput
                    checked={props.checkList[3]}
                    fieldName="温度(℃)"
                    text={props.temperature}
                    maxLength={100}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={false}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 3)}
                    onInputChange={(e) => props.onInputChange(e, "temperature")}
                />

                <CompoundInput
                    checked={props.checkList[4]}
                    fieldName="湿度(%RH)"
                    text={props.humidity}
                    maxLength={100}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={false}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 4)}
                    onInputChange={(e) => props.onInputChange(e, "humidity")}
                />

                {/* <Space align="start" size={'small'}>
                    <Input.TextArea className="mp-charinbox-textarea" placeholder="标准规定" showCount maxLength={1000} value={props.standard} onChange={(e)=>props.onInputChange(e, "standard")} />
                    <Switch className="invisible" checkedChildren="显示" unCheckedChildren="忽略" checked={props.checkList[0]} onClick={(checked, e) => props.onSwitchClick(checked, e, 0)} />
                </Space> */}

                {/* <Space align="start" size={'small'}>
                    <Input.TextArea className="mp-charinbox-textarea" placeholder="人工鉴别结果" showCount maxLength={1000} value={props.manualResult} onChange={(e) => props.onInputChange(e, "manualResult")} />
                    <Switch className="invisible" checkedChildren="显示" unCheckedChildren="忽略" checked={props.checkList[1]} onClick={(checked, e) => props.onSwitchClick(checked, e, 1)} />
                </Space> */}

                {/* <Space size={'small'}>
                    <Input addonBefore={<><span style={{ color: "red" }}>* </span> <span>日期</span></>} defaultValue="" value={props.date} onChange={(e) => props.onInputChange(e, "date")} />
                    <Switch checkedChildren="显示" unCheckedChildren="忽略" checked={props.checkList[2]} onClick={(checked, e) => props.onSwitchClick(checked, e, 2)} />
                </Space> */}

                {/* <Space size={'small'}>
                    <Input addonBefore={<><span style={{ color: "red" }}>* </span> <span>温度(℃)</span></>} defaultValue="" value={props.temperature} onChange={(e) => props.onInputChange(e, "temperature")} />
                    <Switch checkedChildren="显示" unCheckedChildren="忽略" checked={props.checkList[3]} onClick={(checked, e) => props.onSwitchClick(checked, e, 3)} />
                </Space> */}

                {/* <Space size={'small'}>
                    <Input addonBefore={<><span style={{ color: "red" }}>* </span> <span>湿度(%RH)</span></>} defaultValue="" value={props.humidity} onChange={(e) => props.onInputChange(e, "humidity")} />
                    <Switch checkedChildren="显示" unCheckedChildren="忽略" checked={props.checkList[4]} onClick={(checked, e) => props.onSwitchClick(checked, e, 4)} />
                </Space> */}


                <div className="mp-character-btnlist">

                    <Space size={'large'}>

                        <Button disabled={!isSaveBtnActive} type="primary" size={'large'} onClick={props.onSaveInfoClick}>
                            保存
                        </Button>

                        <Button type="primary" size={'large'} onClick={props.onUploadSampleImgClick}>
                            上传样本图片
                        </Button>

                        <Button size={'large'} onClick={props.onExamineStandardImgClick}>
                            查看标准样本文件
                        </Button>

                        <Button disabled={!isReportBtnActive} size={'large'} onClick={props.onViewReportClick}>
                            预览报告
                        </Button>

                        <Button size={'large'} onClick={props.onExamineAttachmentClick}>
                            附件管理
                        </Button>
                    </Space>
                </div>

            </Space>
        </div>
    );
}