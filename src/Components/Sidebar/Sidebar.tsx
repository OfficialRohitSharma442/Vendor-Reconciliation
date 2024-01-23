// Sidebar.jsx
import React, { useState } from 'react';
import {Button, Layout } from 'antd';
import { LogoutOutlined} from '@ant-design/icons';
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
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setloading] = React.useState(false);
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                trigger={null}
                reverseArrow={true}
                onCollapse={() => setCollapsed(!collapsed)}
                collapsedWidth="70"
                theme='light'

            >
                <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
                <SidebarMenu />
                <div className='sidebar_footer'>
                    <div className={`sidebar_footer_content ${!collapsed ? "f-sidegap" : "j_center"}`}>
                        <Button
                            type="primary"
                            icon={<LogoutOutlined />}
                            loading={loading}
                            onClick={() => {
                                setloading(true);
                                setTimeout(() => {

                                    Cookies.remove("VR-user_Role");
                                    setReload(!reload)
                                }, 1000)
                            }}
                            danger
                        >
                        </Button>
                        <div className='sideFooter_userName'>{!collapsed && JSON.parse(Cookies.get('VR-user_Role') || "null")?.username}</div>
                    </div>
                </div>
            </Sider>
            <Layout className="site-layout">
                <Content>
                    <div style={{ overflow: "auto", maxHeight: "100vh" }}>
                        <RoutesPage />
                    </div>
                </Content>
            </Layout>
        </Layout >
    );
};

export default Sidebar;
