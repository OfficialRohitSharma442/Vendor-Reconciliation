
import { message, Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import axios from 'axios';
import React, { ChangeEvent } from "react";


const { Option } = Select;
// import { , Space } from 'antd';
const Adduser: React.FC = ({ open, onClose, getuserdata }: any) => {
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
    const handleOnCreateUser = async () => {
        try {
            console.log(userdata);
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
            setloading(false)
            // showDetaillistData()
            getuserdata()
            onClose()
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
                                label="User Name"
                                name="username"
                                rules={[{ required: true, message: 'Please enter User Name' }]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    // addonBefore="http://"
                                    name="username"
                                    // addonAfter=".com"
                                    onChange={handleOnChangeEventHandler}
                                    placeholder="Please Enter User Name"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Please Enter Email' }]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    // addonBefore="http://"
                                    name="email"
                                    // addonAfter=".com"
                                    onChange={handleOnChangeEventHandler}
                                    placeholder="Please Email Name"
                                />
                                {/* <Select placeholder="Please select an owner">
                                    <Option value="xiao">Xiaoxiao Fu</Option>
                                    <Option value="mao">Maomao Zhou</Option>
                                </Select> */}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please Enter the Password' }]}
                            >
                                {/* <Select placeholder="Please choose the type">
                                    <Option value="private">Private</Option>
                                    <Option value="public">Public</Option>
                                </Select> */}
                                <Input.Password
                                    style={{ width: '100%' }}
                                    // addonBefore="http://"
                                    name="password"
                                    onChange={handleOnChangeEventHandler}
                                    // addonAfter=".com"
                                    placeholder="Please Enter the Password"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row gutter={16}>
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
                    </Row> */}
                    {/* <Row gutter={16}>
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
                       
                    </Col>
                </Row> */}
                    <Space>
                        <Button loading={loading} onClick={handleOnCreateUser} type="primary">
                            Submit
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                </Form>
            </Drawer >
        </>
    );
};

export default Adduser;
