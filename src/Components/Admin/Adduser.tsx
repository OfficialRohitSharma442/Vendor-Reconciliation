import { Button, Col, Drawer, Form, Input, Row, Space, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { ChangeEvent } from "react";


interface AddAdminProps {
  open: boolean;
  onClose: () => void;
  getuserdata: () => Promise<void>;
}
const Adduser: React.FC<AddAdminProps> = ({
  open,
  onClose,
  getuserdata,
}: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [userdata, setuserdata] = React.useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setloading] = React.useState(false);


  const handleOnCreateUser = async () => {
    try {
      const alldata: any = Cookies.get("VR-user_Role");
      const token = JSON.parse(alldata).token;
      setloading(true);
      const response = await axios.post(
        "https://concerned-plum-crayfish.cyclic.app/api/user/signup",
        userdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setuserdata({
        username: "",
        email: "",
        password: "",
        fullName: "",
      })
      if (response.status === 201) {
        messageApi.open({
          type: "success",
          content: "User Added Successfully",
        });
        setTimeout(() => {
          messageApi.destroy();
          onClose();
        }, 1000)
      } else {
        messageApi.open({
          type: "warning",
          content: "Somting went worng...",
        });
        setTimeout(() => {
          messageApi.destroy();
        }, 2000);
      }
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error?.response?.data?.error,
      });
      setTimeout(() => {
        messageApi.destroy();
      }, 2000)
    } finally {
      setloading(false);
      getuserdata();

    }
  };
  const handleOnChangeEventHandler = (
    ev: ChangeEvent<HTMLInputElement>
  ): void => {
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
        onClose={() => {
          onClose()
        }}
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
                rules={[
                  { required: true, message: "Please enter Name" },
                  {
                    validator: (_, value) => {
                      if (!value || value.match(/^[a-zA-Z0-9]+$/)) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Please enter a valid Name (only letters and numbers, no spaces)");
                    },
                  },
                ]}
              >
                <Input
                  name="fullName"
                  placeholder="Please enter Name"
                  onChange={handleOnChangeEventHandler}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="User Name"
                name="username"
                rules={[
                  { required: true, message: "Please enter User Name" },
                  {
                    validator: (_, value) => {
                      if (!value || value.match(/^[a-zA-Z0-9]+$/)) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Please enter a valid User Name (only letters and numbers, no spaces)");
                    },
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
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
                rules={[{ required: true, message: "Please Enter Email" }, {
                  validator: (_, value) => {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                    if (!value || (value.match(emailRegex) && value.indexOf('@') === value.lastIndexOf('@') && value.indexOf('@') > 0 && value.indexOf('@') < value.length - 1)) {
                      return Promise.resolve();
                    }

                    return Promise.reject("Please enter a valid Email address without special characters, except for one '@'");
                  },
                },]}
              >
                <Input
                  style={{ width: "100%" }}
                  // addonBefore="http://"
                  name="email"
                  // addonAfter=".com"
                  onChange={handleOnChangeEventHandler}
                  placeholder="Please Email Name"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please Enter the Password" },
                  {
                    min: 8, // Minimum password length
                    message: "Password must be at least 8 characters",
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Requires at least one lowercase letter, one uppercase letter, and one number
                    message: "Password must include at least one lowercase letter, one uppercase letter, and one number",
                  },
                ]}
              >
                <Input.Password
                  style={{ width: "100%" }}
                  // addonBefore="http://"
                  name="password"
                  onChange={handleOnChangeEventHandler}
                  // addonAfter=".com"
                  placeholder="Please Enter the Password"
                />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button
              loading={loading}
              onClick={handleOnCreateUser}
              type="primary"
              disabled={(userdata.username == "" || userdata.email == "" || userdata.password == "" || userdata.fullName == "")}
            >
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form>
      </Drawer>
    </>
  );
};

export default Adduser;
