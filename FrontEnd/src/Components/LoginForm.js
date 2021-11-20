import React from "react"
import { Form, Input, Button, Space, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const url = "http://127.0.0.1:42424/check_credentials"

export default function LoginForm (){
  const onFinish = (values) => {
    
    
    console.log('Success:', values);
    fetch(url+"?username="+values.username+"&password="+values.password,{mode: 'no-cors'});
  };

  return (
    <div className="site-card-border-less-wrapper">
      <Card title="Login" bordered={false} style={{ width: 300 }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <a href="/giorgio">register now!</a>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};