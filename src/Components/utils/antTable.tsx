import React from 'react';
import { Table } from 'antd';

const MappingHeadersTable = ({ contents }) => {
    const columns = [
        {
            title: 'Mapped Columns',
            dataIndex: 'mappedKey',
            key: 'mappedKey',
            // align: 'center',
            width: '50%',
            // render: (text) => <div style={{ padding: '8px', border: '1px solid #ddd' }}>{text}</div>,
        },
        {
            title: 'Uploaded File Columns',
            dataIndex: 'uploadedValue',
            key: 'uploadedValue',
            // align: 'center',
            width: '50%',
            // render: (text) => <div style={{ padding: '8px', border: '1px solid #ddd' }}>{text}</div>,
        },
    ];
    const data = contents.map(([mappedKey, uploadedValue], index) => ({
        key: index.toString(),
        mappedKey,
        uploadedValue,
    }));

    return (
        <div style={{ overflow: "auto" }}>
            <Table
                columns={columns}
                dataSource={data}
                bordered
                size="small"
                pagination={false}
                scroll={{ y: 240 }}
            // loading={true}
            // title={() => <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Mapping Preview</div>}
            // style={{ marginBottom: '16px' }}
            />
        </div>
    );
};

export default MappingHeadersTable;
