// Sidebar.jsx
import React, { useState } from 'react';
import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import SidebarHeader from './Sidebarheader';
import SidebarMenu from './SidebarMenu';
import RoutesPage from './RoutesPage';

const { Sider, Content } = Layout;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} theme='light'>
                <SidebarHeader collapsed={collapsed} />
                <SidebarMenu />
            </Sider>
            <Layout className="site-layout">
                <Content style={{ margin: '16px' }}>
                    <RoutesPage />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
