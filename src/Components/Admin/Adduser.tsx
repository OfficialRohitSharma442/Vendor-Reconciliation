
import { message, Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import axios from 'axios';
import React, { ChangeEvent } from "react";


const { Option } = Select;
// import { , Space } from 'antd';
const Adduser: React.FC = ({ open, onClose }: any) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [userdata, setuserdata] = React.useState({
        username: "",
        email: "",
        password: "",
        fullName: ""
    });
    const [loading, setloading] = React.useState(false);

    // const success = () => {
    //     messageApi.open({
    //         type: 'success',
    //         content: 'User Added Successfully',
    //     });
    //     setTimeout(() => {
    //         messageApi.destroy()
    //     }, 2000)
    // };
    const handleaddadmin = async () => {
        try {
            let alldata: any = localStorage.getItem("VR-user_Role");
            let token = JSON.parse(alldata).token;
            setloading(true);
            let response = await axios.post("https://concerned-plum-crayfish.cyclic.app/api/user/signup", userdata, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.status === 201) {
                // Update the state with the response data
                console.log(response);
                messageApi.open({
                    type: 'success',
                    content: 'User Added Successfully',
                });
                messageApi.destroy()
                // }, 2000)
            } else {
                messageApi.open({
                    type: 'warning',
                    content: 'Somting went worng...',
                });
                setTimeout(() => {
                    messageApi.destroy()
                }, 2000)
            }
        } catch (error: any) {
            // console.log(error.response.status);
            const { status } = error;

            // messageApi.open({
            //     type: 'warning',
            //     content: `${status == 400 ? "user Not found" : "invalid user name or Password "}`,
            // });
            // setTimeout(() => {
            //     messageApi.destroy()

            // }, 2000)

        } finally {
            // setloading(false)
            // showDetaillistData()
            // onClose()
        }
    };
    const handleOnChangeEventHandler = (ev: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = ev.target;
        setuserdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <>
            {contextHolder}
            <Drawer
                title="Create a new account"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}

                forceRender={true}
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Name"
                                rules={[{ required: true, message: 'Please enter Name' }]}
                            >
                                <Input name="fullName" placeholder="Please enter Name" onChange={handleOnChangeEventHandler} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="NA"
                                rules={[{ required: true, message: 'Please enter url' }]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    addonBefore="http://"
                                    addonAfter=".com"
                                    placeholder="Please enter url"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="owner"
                                label="Owner"
                                rules={[{ required: true, message: 'Please select an owner' }]}
                            >
                                <Select placeholder="Please select an owner">
                                    <Option value="xiao">Xiaoxiao Fu</Option>
                                    <Option value="mao">Maomao Zhou</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true, message: 'Please choose the type' }]}
                            >
                                <Select placeholder="Please choose the type">
                                    <Option value="private">Private</Option>
                                    <Option value="public">Public</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="approver"
                                label="Approver"
                                rules={[{ required: true, message: 'Please choose the approver' }]}
                            >
                                <Select placeholder="Please choose the approver">
                                    <Option value="jack">Jack Ma</Option>
                                    <Option value="tom">Tom Liu</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="dateTime"
                                label="DateTime"
                                rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                                <DatePicker.RangePicker
                                    style={{ width: '100%' }}
                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'please enter url description',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} placeholder="please enter url description" />
                            </Form.Item>
                            <Space>
                                <Button onClick={() => { }} type="primary">
                                    Submit
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default Adduser;
