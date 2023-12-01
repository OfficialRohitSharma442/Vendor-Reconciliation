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
            {/* Universal Header */}

            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} theme='light'>
                <SidebarHeader collapsed={collapsed} />
                <SidebarMenu />
            </Sider>
            <Layout className="site-layout">
                <div style={{ background: "#ffffff", padding: '16px', width: '100%', borderBottom: "1px solid #dcd2d2" }}>
                    {/* Your header content goes here */}
  
                    Universal Header
                </div>
                <Content style={{ margin: '16px' }}>
                    {/* Universal Header */}

                    <RoutesPage />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
