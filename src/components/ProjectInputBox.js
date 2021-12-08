import React from 'react';
import './ProjectInputBox.css';
import { Space, Button } from 'antd';
import CompoundInput from './CompoundInput';


export default function ProjectInputBox(props) {

    var extraCompoundInput = [];

    const config = {
        textWidth: 400
    }

    for (let i = 0; i < props.projectExtraInfo.length; i++) {
        extraCompoundInput.push(
            // key 设置为 i 只是为了消除警告
            // 这样设置没有问题, 因为数据源的相对顺序是正确的
            <CompoundInput
                checked={props.projectInfoDisplay[i+4]}
                fieldName={props.projectExtraInfo[i].fieldName}
                text={props.projectExtraInfo[i].fieldValue}
                isRequired={true}
                textWidth={config.textWidth}
                key={i}

                onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, i+4)}
                onInputChange={(e)=>props.onInputChange(e, i+4)}
            />
        )
    }

    return (
        <div className="mp-projinbox mp-vlist">
            <Space className="mp-vlist" direction="vertical" size={'middle'}>
                <CompoundInput
                    checked={props.projectInfoDisplay[0]}
                    fieldName="检品名称"
                    text={props.projectInfo.name}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={true}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 0)}
                    onInputChange={(e)=>props.onInputChange(e, 0)}
                />
                <CompoundInput
                    checked={props.projectInfoDisplay[1]}
                    fieldName="检品编号"
                    text={props.projectInfo.sampleId}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={true}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 1)}
                    onInputChange={(e)=>props.onInputChange(e, 1)}
                />
                <CompoundInput
                    checked={props.projectInfoDisplay[2]}
                    fieldName="执行标准"
                    text={props.projectInfo.standard}
                    isRequired={true}
                    textWidth={config.textWidth}
                    isSwitchInvisible={true}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 2)}
                    onInputChange={(e)=>props.onInputChange(e, 2)}
                />
                <CompoundInput
                    checked={props.projectInfoDisplay[3]}
                    fieldName="备注"
                    text={props.projectInfo.note}
                    isRequired={false}
                    textWidth={config.textWidth}
                    isSwitchInvisible={true}

                    onSwitchClick={(checked, e) => props.onSwitchClick(checked, e, 3)}
                    onInputChange={(e)=>props.onInputChange(e, 3)}
                />

                {extraCompoundInput}

                <div className="mp-character-btnlist">
                
                    <Space size={'large'}>

                        <Button type="primary" size={'large'} onClick={props.onSaveInfoClick}>
                            保存
                        </Button>

                        <Button size={'large'} onClick={props.onEditInfoClick}>
                            编辑附加信息
                        </Button>

                        <Button size={'large'} onClick={props.onAddTaskClick}>
                            添加任务
                        </Button>

                        <Button size={'large'} onClick={props.onViewReportClick}>
                            预览报告
                        </Button>

                        <Button size={'large'} onClick={props.onExamineAttachmentClick}>
                            附件管理
                        </Button>

                    </Space>
                </div>

            </Space>
        </div>
    )
}
