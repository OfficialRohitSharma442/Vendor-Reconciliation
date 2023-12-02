import React from "react";
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SettingTwoTone, FileTextOutlined, SettingOutlined, HomeOutlined, ImportOutlined, UserAddOutlined } from '@ant-design/icons';
import { Context } from '../Context/Context';
const SidebarMenu = () => {
    const { role } = React.useContext(Context)
    const navigate = useNavigate();

    const items = [
        { label: 'Home', path: '/Home', icon: <HomeOutlined /> },
        { label: 'Import', path: '/Import', icon: <ImportOutlined /> },
        { label: 'Add Vendor', path: '/VenderPage', icon: <UserAddOutlined /> },
        { label: 'Reports', path: '/Reports', icon: <FileTextOutlined /> },
        (role == "ADMIN") && { label: 'Admin Page', path: '/Settings', icon: <SettingOutlined /> },

    ];
    const masteritems = [{ label: 'Super Admin', path: '/admin', icon: <SettingTwoTone /> }]

    return (
        <Menu
            onClick={({ key }) => {
                navigate(key);
            }}
            mode="inline"
        >
            {
                (role === "MASTER" ? masteritems : items).map((item, index) => (
                    <Menu.Item key={item?.path} icon={item.icon} >
                        {item?.label}
                    </Menu.Item>
                ))
            }
        </Menu>
    );
};

export default SidebarMenu;
