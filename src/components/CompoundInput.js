import React from 'react';
import './CompoundInput.css';
import { Input, Space, Switch } from 'antd';

export default function CompoundInput(props) {

    var textAreaWidth = 300;
    var fieldWidth = 100;
    var isSwitchHidden = false;
    var maxLength = 100;

    if (props.textWidth !== undefined) {
        textAreaWidth = props.textWidth;
    }

    if (props.nameWidth !== undefined) {
        fieldWidth = props.nameWidth;
    }

    if (props.isSwitchHidden !== undefined) {
        isSwitchHidden = props.isSwitchHidden;
    }

    if (props.maxLength !== undefined) {
        maxLength = props.maxLength;
    }

    if (!isSwitchHidden) {
        return (
            <div className="mp-c-cpdipt">
                <Space align="start" size={'small'}>
                    <div className="mp-c-cpdipt-fieldname" style={{ width: fieldWidth }}>
                        <h3>
                            <span style={{color: "red"}}>{props.isRequired ? "*" : ""} </span>
                            {props.fieldName}
                        </h3>
                    </div>
                    <Input.TextArea showCount maxLength={maxLength} value={props.text} style={{ width: textAreaWidth }} onChange={props.onInputChange} />
                    <Switch checkedChildren="显示" unCheckedChildren="忽略" checked={props.checked} onClick={props.onSwitchClick} />
                </Space>
            </div>
        );
    } else {
        return (
            <div className="mp-c-cpdipt">
                <Space align="start" size={'small'}>
                    <div className="mp-c-cpdipt-fieldname" style={{ width: fieldWidth }}>
                        <h3>
                            <span style={{color: "red"}}>{props.isRequired ? "*" : ""} </span>
                            {props.fieldName}
                        </h3>
                    </div>
                    <Input.TextArea showCount maxLength={maxLength} value={props.text} style={{ width: textAreaWidth }} onChange={props.onInputChange} />
                </Space>
            </div>
        );
    }
}
