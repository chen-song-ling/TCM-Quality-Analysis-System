import React from 'react';
import './AILoading.css';
import { Spin, Space } from 'antd';

export default function AILoading(props) {

    const renderSpin = () => {
        if (props.loading === true) {
            return (
                <Space className="mp-vlist" direction="vertical" size={'small'}>
                    <p> 请等待服务器算法运行结束 </p>
                    <Spin />
                </Space>
            );
        } else {
            return null;
        }
    }

    return (
        <div className="mp-c-ailoading">
            {renderSpin()}
        </div>
    );
}
