import { Badge, Card, Col, Row, Select, SelectProps, Space, Typography } from 'antd';
const Home = () => {
    const options: SelectProps['options'] = [];
    for (let i = 10; i < 36; i++) {
        options.push({
            value: i.toString(36) + i,
            label: i.toString(36) + i,
        });
    }
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
            <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
                <div>

                    <label htmlFor="">This is a lable </label>
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={() => console.log("hii")}
                        tokenSeparators={[',']}
                        options={options}

                    />
                </div>
                <div>

                    <label htmlFor="">This is a lable </label>
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={() => console.log("hii")}
                        tokenSeparators={[',']}
                        options={options}
                    />
                </div>
            </div>
            {/* <Line options={options} data={data} /> */}
            <div style={{ display: "flex" }}>
                <div style={{ margin: "10px", display: "grid", gap: "10px", maxHeight: "450px", width: "100%", overflow: "auto", padding: "10px" }}>

                    <Badge.Ribbon text="Hippies">
                        <Card title="Pushes open the window" size="small">
                            and raises the spyglass.
                        </Card>
                    </Badge.Ribbon>
                    <Badge.Ribbon text="Hippies">
                        <Card title="Pushes open the window" size="small">
                            and raises the spyglass.
                        </Card>
                    </Badge.Ribbon>
                    <Badge.Ribbon text="Hippies">
                        <Card title="Pushes open the window" size="small">
                            and raises the spyglass.
                        </Card>
                    </Badge.Ribbon>
                </div>
            </div>
        </div>
    );
};

export default Home;
