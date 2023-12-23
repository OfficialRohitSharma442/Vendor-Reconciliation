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
                setRole(response?.data?.role)
                messageApi.open({
                    type: 'success',
                    content: 'User Loged in Successfully',
                });
                messageApi.destroy()
                navigate('/home');
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
            debugger;
            // console.log(error.response.status);
            const { status } = error;

            messageApi.open({
                type: 'warning',
                content: `${status == 400 ? "user Not found" : "invalid user name or Password "}`,
            });
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
                    label={<span style={{ fontWeight: 'bold', color: '#666' }}>Username</span>}
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    id="username"
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
                    <Button type="primary" loading={loading} onClick={handleLogin} htmlType="submit" style={{ width: '100%', height: '40px', backgroundColor: '#0070c9', borderColor: '#0070c9' }}>
                        Log In
                    </Button>
                </Form.Item>
            </Form>
        </div>

    );
};

export default Login;
