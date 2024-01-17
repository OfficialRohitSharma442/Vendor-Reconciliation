import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  message
} from "antd";
import axios from "axios";
import React, { ChangeEvent } from "react";
import { Context } from "../Context/Context";
interface AddAdminProps {
  open: boolean;
  onClose: () => void;
  showDetaillistData: () => Promise<void>;
}
// @ ts-ignore
const AddAdmin: React.FC<AddAdminProps> = ({
  open,
  onClose,
  showDetaillistData,
}: any) => {
  const { token } = React.useContext(Context);

  const [messageApi, contextHolder] = message.useMessage();
  const [admindata, setadmindata] = React.useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setloading] = React.useState(false);

  const handleaddadmin = async () => {
    try {
      setloading(true);
      const response = await axios.post(
        "https://concerned-plum-crayfish.cyclic.app/api/user/signup",
        admindata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        // Update the state with the response data
        console.log(response);
        messageApi.open({
          type: "success",
          content: "User Added Successfully",
        });
        setTimeout(() => {
          messageApi.destroy();
          onClose();
        }, 2000)
        // messageApi.destroy();
        // }, 2000)
      } else {
        messageApi.open({
          type: "warning",
          content: "Somting went worng...",
        });
        setTimeout(() => {
          onClose();
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
      showDetaillistData();

    }
  };
  const handleOnChangeEventHandler = (
    ev: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = ev.target;
    setadmindata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      {contextHolder}
      <Drawer
        title="Create a new Admin"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        // extra={

        // }
        forceRender={true}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Name"
                rules={[
                  { required: true, message: "Please enter user name" },
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
                  placeholder="Please enter user name"
                  onChange={handleOnChangeEventHandler}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter Email" },
                {
                  validator: (_, value) => {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                    if (!value || (value.match(emailRegex) && value.indexOf('@') === value.lastIndexOf('@') && value.indexOf('@') > 0 && value.indexOf('@') < value.length - 1)) {
                      return Promise.resolve();
                    }

                    return Promise.reject("Please enter a valid Email address without special characters, except for one '@'");
                  },
                },

                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  name="email"
                  placeholder="Please enter Email"
                  onChange={handleOnChangeEventHandler}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user Name"
                label="User Name"
                rules={[
                  { required: true, message: "please Enter User Name" },
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
                  name="username"
                  placeholder="Please enter Username"
                  onChange={handleOnChangeEventHandler}
                />

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[

                  { required: true, message: "Please enter password" },
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
                  placeholder="Please enter Password"
                  name="password"
                  type="password"
                  onChange={handleOnChangeEventHandler}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Organization"
                label="Organization"
                rules={[
                  {
                    required: false,
                    message: "Please enter Organization name",
                  },
                ]}
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[
                  { required: false, message: "Please choose the dateTime" },
                ]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
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
                    required: false,
                    message: "please enter url description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="please enter url description"
                />
              </Form.Item>
              
          </Row> */}
          <Space>
            <Button
              loading={loading}
              onClick={handleaddadmin}
              type="primary"
              disabled={(admindata.username == "" || admindata.email == "" || admindata.password == "" || admindata.fullName == "")}
            >
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>

        </Form>
      </Drawer >
    </>
  );
};

export default AddAdmin;
