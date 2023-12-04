// Sidebar.jsx
import React, { useState } from 'react';
import { Button, Layout } from 'antd';
import { MenuFoldOutlined, ArrowLeftOutlined, ArrowRightOutlined, PoweroffOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import SidebarHeader from './Sidebarheader';
import SidebarMenu from './SidebarMenu';
import RoutesPage from './RoutesPage';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context/Context';
const { Sider, Content } = Layout;
const Sidebar = () => {
    const { setReload, reload } = React.useContext(Context);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setloading] = React.useState(false);
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Universal Header */}
            <Sider collapsible collapsed={collapsed} trigger={null} reverseArrow={true} onCollapse={() => setCollapsed(!collapsed)} collapsedWidth="70" theme='light'>
                <SidebarHeader collapsed={collapsed} />
                <SidebarMenu />
            </Sider>
            <Layout className="site-layout">
                <div style={{ background: "#ffffff", padding: '16px', width: '100%', borderBottom: "1px solid #dcd2d2", display: "flex", justifyContent: "space-between" }}>
                    {/* Your header content goes here */}
                    <div>
                        {collapsed ?
                            <Button onClick={() => setCollapsed(!collapsed)}>
                                <MenuFoldOutlined />
                                {/* <ArrowLeftOutlined /> */}
                            </Button>
                            :
                            <Button onClick={() => setCollapsed(!collapsed)}>
                                <CloseOutlined />
                            </Button>
                        }
                    </div>
                    <Button
                        type="primary"
                        icon={<LogoutOutlined />}
                        loading={loading}
                        onClick={() => {
                            setloading(true);
                            setTimeout(() => {
                                localStorage.clear();
                                setReload(!reload)
                            }, 1000)
                        }}
                        danger
                    >
                        Logout
                    </Button>
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
