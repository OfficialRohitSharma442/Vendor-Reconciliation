import React from "react";
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SettingTwoTone, FileTextOutlined, SettingOutlined, HomeOutlined, ImportOutlined, UserAddOutlined } from '@ant-design/icons';
import { Context } from '../Context/Context';

const SidebarMenu = () => {
    const { role } = React.useContext(Context);
    const navigate = useNavigate();
    const items = [
        { label: 'Home', path: '/Home', icon: <HomeOutlined style={{ fontSize: "18px" }} />, key: 'home' },
        { label: 'Import', path: '/Import', icon: <ImportOutlined style={{ fontSize: "18px" }} />, key: 'import' },
        { label: 'Add Vendor', path: '/VenderPage', icon: <UserAddOutlined style={{ fontSize: "18px" }} />, key: 'VenderPage' },
        { label: 'Reports', path: '/Reports', icon: <FileTextOutlined style={{ fontSize: "18px" }} />, key: 'reports' },
        ...(role === "ADMIN" ? [{ label: 'Admin Page', path: '/Settings', icon: <SettingOutlined style={{ fontSize: "15px" }} />, key: 'Settings' }] : []),
    ];
    const masterItems = [{ label: 'Super Admin', path: '/admin', icon: <SettingTwoTone />, key: 'admin' }];

    return (
        <Menu
            onClick={({ key }) => {
                navigate(key);
            }}
            mode="inline"
            defaultSelectedKeys={['/Home']}
        >
            {(role === "MASTER" ? masterItems : items).map((item) => (
                <Menu.Item key={item.key} icon={item.icon} style={{ fontSize: "16px", marginTop: 10, marginBottom: 10 }}>
                    {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default SidebarMenu;
