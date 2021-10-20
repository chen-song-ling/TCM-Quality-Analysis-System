import React from 'react';
import { Menu, Dropdown, Breadcrumb, PageHeader } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './MpHeader.css';


export default function MpHeader(props) {
    const menu = (
        <Menu>
          <Menu.Item key={1} danger onClick={props.onQuitClick}>退出登陆</Menu.Item>
        </Menu>
    );

    const dropdown = (
        <Dropdown overlay={menu}>
            <a className="mp-c-mpheader-dropdown" onClick={e => e.preventDefault()}>
            {props.username}
            <DownOutlined />
            </a>
        </Dropdown>
    );

    var breadcrumbItems = [];
    /*
    props.onBreadClick
    props.breadItems = [
        {
            text: 首页
            isActive: true,
            funcTag: home,
        },
    ]
    */
    const renderBreadcrumb = () => {
        for (let i = 0; i < props.breadItems.length; i++) {
            if (props.breadItems[i].isActive) {
                breadcrumbItems.push(
                    <Breadcrumb.Item key={i} onClick={(e) => props.onBreadClick(e, props.breadItems[i].funcTag)} style={{cursor: "pointer"}} >{props.breadItems[i].text}</Breadcrumb.Item>
                );
            } else {
                breadcrumbItems.push(
                    <Breadcrumb.Item key={i} >{props.breadItems[i].text}</Breadcrumb.Item>
                );
            }
        }
    }
    renderBreadcrumb();

    return (
        <div className="mp-c-mpheader">
            <PageHeader
                onBack={props.onHeaderBackClick}
                title="中药质量标准数字评价系统"
                subTitle={dropdown}
            />
            <div className="mp-c-mpheader-nav">
                <Breadcrumb className="mp-c-mpheader-nav-bread">
                    {breadcrumbItems}
                </Breadcrumb>

            </div>
        </div>
    );
}
