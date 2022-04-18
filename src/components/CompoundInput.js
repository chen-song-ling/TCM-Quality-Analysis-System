import React from 'react';
import './CompoundInput.css';
import { Input, Space, Switch } from 'antd';

export default function CompoundInput(props) {

    var textAreaWidth = 300;
    var fieldWidth = 100;
    var isSwitchHidden = false;
    var isSwitchInvisible = false;
    var maxLength = 100;
    var isDisabled = false;
    var isPassword = false;

    if (props.textWidth !== undefined) {
        textAreaWidth = props.textWidth;
    }

    if (props.nameWidth !== undefined) {
        fieldWidth = props.nameWidth;
    }

    if (props.isSwitchHidden !== undefined) {
        isSwitchHidden = props.isSwitchHidden;
    }

    if (props.isSwitchInvisible !== undefined) {
        isSwitchInvisible = props.isSwitchInvisible;
    }

    if (props.maxLength !== undefined) {
        maxLength = props.maxLength;
    }

    if (props.isDisabled !== undefined) {
        isDisabled = props.isDisabled;
    }

    if (props.isPassword !== undefined) {
        isPassword = props.isPassword;
    }

    if (isSwitchHidden === false && isSwitchInvisible === false) {
        return (
            <div className="mp-c-cpdipt">
                <Space align="start" size={'small'}>
                    <div className="mp-c-cpdipt-fieldname" style={{ width: fieldWidth }}>
                        <h3>
                            <span style={{ color: "red" }}>{props.isRequired ? "*" : ""} </span>
                            {props.fieldName}
                        </h3>
                    </div>
                    <Input.TextArea autoSize showCount maxLength={maxLength} value={props.text} style={{ width: textAreaWidth }} onChange={props.onInputChange} disabled={isDisabled} />
                    <Switch checkedChildren="显示" unCheckedChildren="忽略" checked={props.checked} onClick={props.onSwitchClick} />
                </Space>
            </div>
        );
    } else if (isSwitchInvisible === true) {
        return (
            <div className="mp-c-cpdipt">
                <Space align="start" size={'small'}>
                    <div className="mp-c-cpdipt-fieldname" style={{ width: fieldWidth }}>
                        <h3>
                            <span style={{ color: "red" }}>{props.isRequired ? "*" : ""} </span>
                            {props.fieldName}
                        </h3>
                    </div>
                    <Input.TextArea autoSize showCount maxLength={maxLength} value={props.text} style={{ width: textAreaWidth }} onChange={props.onInputChange} disabled={isDisabled} />
                    <Switch className="invisible" checkedChildren="显示" unCheckedChildren="忽略" checked={props.checked} onClick={props.onSwitchClick} />
                </Space>
            </div>
        );
    } else {
        if (isPassword === false) {
            return (
                <div className="mp-c-cpdipt">
                    <Space align="start" size={'small'}>
                        <div className="mp-c-cpdipt-fieldname" style={{ width: fieldWidth }}>
                            <h3>
                                <span style={{ color: "red" }}>{props.isRequired ? "*" : ""} </span>
                                {props.fieldName}
                            </h3>
                        </div>
                        <Input.TextArea autoSize showCount maxLength={maxLength} value={props.text} style={{ width: textAreaWidth }} onChange={props.onInputChange} disabled={isDisabled} />
                    </Space>
                </div>
            );
        } else {
            return (
                <div className="mp-c-cpdipt">
                    <Space align="start" size={'small'}>
                        <div className="mp-c-cpdipt-fieldname" style={{ width: fieldWidth }}>
                            <h3>
                                <span style={{ color: "red" }}>{props.isRequired ? "*" : ""} </span>
                                {props.fieldName}
                            </h3>
                        </div>
                        <Input.Password autoSize showCount maxLength={maxLength} value={props.text} style={{ width: textAreaWidth }} onChange={props.onInputChange} disabled={isDisabled} visibilityToggle={false} />
                    </Space>
                </div>
            );
        }
    }
}
