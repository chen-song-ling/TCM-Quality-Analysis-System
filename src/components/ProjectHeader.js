import React from 'react';
import './ProjectHeader.css';
import { Menu, Dropdown, Breadcrumb, PageHeader } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function ProjectHeader(props) {
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
                    <Breadcrumb.Item onClick={(e) => props.onBreadClick(e, "home")} style={{cursor: "pointer"}} >首页</Breadcrumb.Item>

                    <Breadcrumb.Item>项目</Breadcrumb.Item>
                </Breadcrumb>

            </div>
        </div>
    );
}
