
import { Space } from 'antd';

const SidebarHeader = ({ collapsed }: any) => (
    <div style={{ background: '#fff', padding: 10, display: 'flex', alignItems: 'center', transition: 'width 0.2s' }}>
        <Space>
            {/* <div style={{ width: 32, height: 32, backgroundColor: 'lightgray', marginRight: 10 }}></div> */}
            {<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150, fontSize: "14px", fontWeight: "700", textAlign: "center" }}>{!collapsed && "Vendor Reconciliation"}</div>}
        </Space>
    </div>
);

export default SidebarHeader;
