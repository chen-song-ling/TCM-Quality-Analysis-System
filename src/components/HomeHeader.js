import React from 'react';
import { useState, useEffect } from "react";

import './HomeHeader.css';
import { Menu, Dropdown, Breadcrumb, Input, Button, Space, PageHeader } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';

export default function HomeHeader(props) {
    const [searchInput, setSearchInput] = useState("");

    const onSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    }

    const menu = (
        <Menu>
          <Menu.Item danger onClick={props.onQuitClick}>退出登陆</Menu.Item>
        </Menu>
    );

    const dropdown = (
        <Dropdown overlay={menu}>
            <a className="mp-c-header-dropdown" onClick={e => e.preventDefault()}>
            {props.username}
            <DownOutlined />
            </a>
        </Dropdown>
    );

    return (
        <div className="mp-c-header">
            <PageHeader
                onBack={() => null}
                title="中药质量标准数字评价系统"
                subTitle={dropdown}
            />
            <div className="mp-c-nav">
                <Breadcrumb className="mp-c-nav-bread">
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                </Breadcrumb>
                <div className="mp-c-nav-subtitile">
                    <Space size={'large'}>

                        <Input.Search placeholder="搜索" onSearch={() => props.onSearch(searchInput) } value={searchInput} onChange={onSearchInputChange} style={{ width: 200 }} />
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={props.onAddClick} />

                    </Space>
                </div>

            </div>
        </div>
    );
}
