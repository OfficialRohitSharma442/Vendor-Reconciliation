import React from "react";
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SettingTwoTone, FileTextOutlined, SettingOutlined, HomeOutlined, ImportOutlined, UserAddOutlined } from '@ant-design/icons';
import { Context } from '../Context/Context';

const SidebarMenu = () => {
    const { role } = React.useContext(Context);
    const navigate = useNavigate();

    const items = [
        { label: 'Home', path: '/Home', icon: <HomeOutlined />, key: 'home' },
        { label: 'Import', path: '/Import', icon: <ImportOutlined />, key: 'import' },
        { label: 'Add Vendor', path: '/VendorPage', icon: <UserAddOutlined />, key: 'addVendor' },
        { label: 'Reports', path: '/Reports', icon: <FileTextOutlined />, key: 'reports' },
        ...(role === "ADMIN" ? [{ label: 'Admin Page', path: '/Settings', icon: <SettingOutlined />, key: 'adminPage' }] : []),
    ];

    const masterItems = [{ label: 'Super Admin', path: '/admin', icon: <SettingTwoTone />, key: 'superAdmin' }];

    return (
        <Menu
            onClick={({ key }) => {
                navigate(key);
            }}
            mode="inline"
            defaultSelectedKeys={['/Home']}

        >
            {(role === "MASTER" ? masterItems : items).map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default SidebarMenu;
