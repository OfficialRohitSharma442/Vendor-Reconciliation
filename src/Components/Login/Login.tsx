import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context/Context';
import Cookies from 'js-cookie';
const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: null,
        password: null
    });
    const [loading, setloading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { setRole } = React.useContext(Context);


    const handleLogin = async () => {
        try {
            setloading(true);
            let response = await axios.post("https://concerned-plum-crayfish.cyclic.app/api/user/login", data);
            if (response?.status == 200) {
                // Update the state with the response data
                Cookies.set('VR-user_Role', JSON.stringify(response?.data), { expires: 1 });
                // localStorage.setItem("VR-user_Role", JSON.stringify(response?.data))
                ;
                setRole(response?.data?.role)
                messageApi.open({
                    type: 'success',
                    content: 'User Loged in Successfully',
                });
                messageApi.destroy()
                if (response?.data?.role === "USER") {
                    navigate('/import');
                } else if (response?.data?.role === "ADMIN") {
                    navigate('/settings');
                } else {
                    navigate('/admin');
                }
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
            ;
            // console.log(error.response.status);
            if (error.response) {
                const { status } = error?.response;

                if (status === 404) {
                    messageApi.open({
                        type: 'error',
                        content: `user Not found`,
                    });
                } else if (status === 400) {
                    messageApi.open({
                        type: 'error',
                        content: `Password is worng Please check the password !`,
                    });
                } else if (status === 401) {
                    messageApi.open({
                        type: 'error',
                        content: `Authentication failed. Your session may have expired. Please log in again to access the requested content.`,
                    });
                }
            }
            else{
                messageApi.open({
                    type: 'error',
                    content: `An error occurred. Please try again later.`,
                });
            }

            setTimeout(() => {
                messageApi.destroy()
            }, 2000)

        } finally {
            setloading(false)
        }
    };
    const onhandlechange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        setData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100vh" }}>
            {contextHolder}
            <Form
                name="basic"
                style={{
                    maxWidth: 400,
                    width: '100%',
                    padding: 20,
                    border: '1px solid #e8e8e8',
                    borderRadius: 12,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <h1 style={{ textAlign: 'center', marginBottom: 20, fontSize: '1.5rem', color: '#333' }}>Login</h1>
                <Form.Item
                    label={<span style={{ fontWeight: 'bold', color: '#666' }}>Email</span>}
                    name="Email"
                    rules={[{ required: true, message: 'Please input your Email Address!' }]}
                    id="email"
                >
                    <Input size="large" type='Email' name="email" onChange={onhandlechange} placeholder="Email ID" style={{ height: '40px', width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontWeight: 'bold', color: '#666' }}>Password</span>}
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    id="password"
                >
                    <Input.Password size="large" name="password" onChange={onhandlechange} placeholder="Password" style={{ height: '40px', width: '100%' }} />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox style={{ color: '#666' }}>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" loading={loading} onClick={handleLogin} htmlType="submit" style={{ width: '100%', height: '40px' }}>
                        Log In
                    </Button>
                </Form.Item>
            </Form>
        </div >

    );
};

export default Login;
