import React from 'react';
import { DownloadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Button } from 'antd';

const { Meta } = Card;

const Cards: React.FC = () => {
    const downloadExcelFile = () => {
        // Add logic to generate and download Excel file
        console.log('Download Excel file');
    };

    const previewExcelFile = () => {
        // Add logic to preview Excel file
        console.log('Preview Excel file');
    };

    const deleteExcelFile = () => {
        // Add logic to delete Excel file
        console.log('Delete Excel file');
    };

    return (
        <Card
            style={{ width: 250, borderRadius: 10, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            cover={
                <img
                    alt="Excel File Cover"
                    src="https://www.tapsmart.com/wp-content/uploads/2019/06/Excel-featured.jpg"
                    style={{ height: 100, objectFit: 'cover' }}
                />
            }
            actions={[
                <Button style={{ border: "none" }} icon={<DownloadOutlined />} onClick={downloadExcelFile} key="download" />,
                <Button style={{ border: "none" }} icon={<EyeOutlined />} onClick={previewExcelFile} key="preview" />,
                <Button style={{ border: "none" }} icon={<DeleteOutlined />} onClick={deleteExcelFile} key="delete" />,
            ]}
        >
            <Meta
                avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                title="Excel File.xlsx"
                description={
                    <>
                        <p>Created Date: 2023-11-27</p>
                        <p>Type: Microsoft Excel</p>
                        <p>Size: 10 KB</p>
                        <p>Last Modified: 2023-11-27</p>
                        <p>This is the Excel file description.</p>
                    </>
                }
                style={{ padding: 0, height: 100, }}
            />
        </Card>
    );
};

export default Cards;
