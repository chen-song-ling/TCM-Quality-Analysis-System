import React from 'react';
import { useState, useEffect } from "react";

import './BankHeader.css';
import { Menu, Dropdown, Breadcrumb, Input, Button, Space, PageHeader } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';

export default function BankHeader(props) {
    const [searchInput, setSearchInput] = useState("");

    const onSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    }


    return (
        <div className="mp-c-bankheader">
            <div 
                style={{height: 72}}
            />
            <div className="mp-c-nav">
                <Breadcrumb className="mp-c-nav-bread">
                    <Breadcrumb.Item></Breadcrumb.Item>
                </Breadcrumb>
                <div className="mp-c-nav-subtitile">
                    <Space size={'large'}>

                        <Input.Search placeholder="搜索" onSearch={() => props.onSearch(searchInput) } value={searchInput} onChange={onSearchInputChange} style={{ width: 200 }} />
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={props.onAddClick} />

                    </Space>
                </div>

            </div>
        </div>
    )
}
