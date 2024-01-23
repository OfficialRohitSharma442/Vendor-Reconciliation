import {Col, Row, Space, Typography } from 'antd';
const Home = () => {
    const renderCard = (title, content, backgroundColor) => (
        <Col span={8}>
            <div>
                <Space direction="vertical" style={{ width: '100%', padding: '10px', background: backgroundColor, borderRadius: '10px' }}>
                    <Typography.Title level={3} style={{ margin: 0, color: 'white' }}>
                        {title}
                    </Typography.Title>
                    <Typography style={{ color: 'white' }}>{content}</Typography>
                </Space>
            </div>
        </Col>
    );
    return (
        <div style={{ margin: '10px' }}>
            <Row gutter={[16, 16]}>
                {renderCard('100', 'Vendors Registered', '#00b96b')}
                {renderCard('500', 'Reconciliation reports', '#00b96b')}
                {renderCard('Card 3', 'Et placeat...', '#00b96b')}
            </Row>
        </div>
    );
};

export default Home;
