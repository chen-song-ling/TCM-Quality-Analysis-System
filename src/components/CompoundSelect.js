import React from 'react';
import './CompoundSelect.css';
import { Space, Select } from 'antd';

export default function CompoundSelect(props) {
    var textAreaWidth = 300;
    var fieldWidth = 100;
    var options = [];

    if (props.textWidth !== undefined) {
        textAreaWidth = props.textWidth;
    }

    if (props.nameWidth !== undefined) {
        fieldWidth = props.nameWidth;
    }

    if (props.options !== undefined) {
        for (let i = 0; i < props.options.length; i++) {
            options.push(
                <Select.Option value={props.options[i].value}>{props.options[i].text}</Select.Option>
            );
        }
    }


    return (
        <div className="mp-c-cpdslt">
            <Space align="start" size={'small'}>
                <div className="mp-c-cpdslt-fieldname" style={{ width: fieldWidth }}>
                    <h3>
                        <span style={{color: "red"}}>{props.isRequired ? "*" : ""} </span>
                        {props.fieldName}
                    </h3>
                </div>
                <Select className=".mp-c-cpdslt-select" defaultValue={props.defaultValue} style={{ width: textAreaWidth }} onChange={props.onSelectChange}>
                    {options}
                </Select>
            </Space>
        </div>
    );
}