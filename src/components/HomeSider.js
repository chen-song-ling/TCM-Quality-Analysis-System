import React from 'react';
import './HomeSider.css';

import { Layout, Menu } from 'antd';

const { Header, Content, Sider } = Layout;

export default function HomeSider(props) {

  var defaultSelectedKeys = [];
  if (props.defaultSelectedKey !== undefined) {
    defaultSelectedKeys = [props.defaultSelectedKey];
  }

  const renderMenuItem = (idx, text) => {
    return (
      <Menu.Item key={idx} onClick={(e)=>props.handleMenuItemClick(idx, e)}>
        {text}
      </Menu.Item>
    );
  }

  const renderMenuRows = (isAdministrator) => {
    let rows = [];
    rows.push(renderMenuItem('0', '个人信息'));
    rows.push(renderMenuItem('1', '项目列表'));
    if (isAdministrator === true) {
      rows.push(renderMenuItem('2', '用户管理'));
      rows.push(renderMenuItem('3', '计算模版管理'));
    }
    return rows;
  }

  return (
    <Sider width={200} className="mp-c-homesider">
      <div
        className="mp-vlist"
        style={{ fontSize: '20px', height: 150 }}
      >

        应用名称
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={defaultSelectedKeys}
        selectable={false}
      >
        {renderMenuRows(props.isAdministrator)}
      </Menu>
    </Sider>
  );
}
