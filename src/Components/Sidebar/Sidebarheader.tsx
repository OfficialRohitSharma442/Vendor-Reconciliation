
import { Button, Space } from 'antd';
import { MenuOutlined, ArrowLeftOutlined, ArrowRightOutlined, PoweroffOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import Typography from 'antd/es/typography/Typography';
import myImage from "./../../assets/vendor-reconciliation-high-resolution-logo-black-transparent.png";
import myImage2 from "./../../assets/vendor-reconciliation-high-resolution-logo-transparent.png";

const SidebarHeader = ({ collapsed, setCollapsed }: any) => (
    <div style={{ marginTop: "15px", margin: "auto", transition: 'width 0.2s' }}>
        <div>
            {<div style={{ padding: "10px", textAlign: "center" }}>
                {collapsed ?
                    <div className='expend_icons_sidebar'>
                        <MenuOutlined style={{ fontSize: '17px' }} onClick={() => setCollapsed(!collapsed)} />
                    </div>
                    :
                    <div className='hamburger_logo_withButton'>
                        <img src={myImage} style={{ width: "145px", height: "45px" }}></img>
                        <CloseOutlined className='closeIcone' onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '17px' }} />
                    </div>

                }</div>}
        </div >
    </div >
);

export default SidebarHeader;
