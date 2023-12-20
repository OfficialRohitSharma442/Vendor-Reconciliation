// Sidebar.jsx
import React, { useState } from 'react';
import { Affix, Button, Layout } from 'antd';
import { MenuFoldOutlined, ArrowLeftOutlined, ArrowRightOutlined, PoweroffOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import SidebarHeader from './Sidebarheader';
import SidebarMenu from './SidebarMenu';
import RoutesPage from './RoutesPage';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context/Context';
import Cookies from "js-cookie"
import "./sidebar.css"
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
                <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
                <SidebarMenu />
            </Sider>

            <Layout className="site-layout">
                <div style={{ background: "#ffffff", padding: '16px', width: '100%', borderBottom: "1px solid #dcd2d2", display: "flex", justifyContent: "space-between" }}>
                    {/* Your header content goes here */}
                    <div>

                    </div>
                    <Button
                        type="primary"
                        icon={<LogoutOutlined />}
                        loading={loading}
                        onClick={() => {
                            setloading(true);
                            setTimeout(() => {
                                // localStorage.clear();
                                Cookies.remove("VR-user_Role");
                                setReload(!reload)
                            }, 1000)
                        }}
                        danger
                    >
                        Logout
                    </Button>
                </div>
                <Content>
                    <div style={{ maxHeight: "calc(100vh - 65px)", overflow: "auto", height: "100%" }}>
                        <RoutesPage />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
