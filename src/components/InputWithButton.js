import React from 'react';
import './InputWithButton.css';
import { Input, Button, Space } from 'antd';

export default function InputWithButton(props) {

    var textAreaWidth = 150;
    var buttondanger = false;

    if (props.textWidth !== undefined) {
        textAreaWidth = props.textWidth;
    }
    if (props.isDanger !== undefined) {
        buttondanger = props.isDanger;
    }

    return (
        <div className="mp-c-inpbtn">
            <Space align="start" size={'small'}>
                <Input.TextArea showCount maxLength={10} value={props.text} style={{ width: textAreaWidth }} onChange={props.onInputChange} />
                <Button type="primary" onClick={props.onButtonClick} danger={buttondanger} >
                    {props.buttonText}
                </Button>
            </Space>
        </div>
    )
}
