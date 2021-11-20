import React from "react"
import { Form, Input, Button, Space, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Session from "react-session-api";
import { BrowserRouter as Redirect } from 'react-router-dom';

export default class LoginForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      redirect: false,
    }
  }
  
  onFinish = async (values) => { 
    var call = await fetch(this.props.url+"/"+this.props.endpoint+"?username="+values.username+"&password="+values.password);
    var response = await call.json();
    
    Session.set("logged",response.status)

    if(response.status == true){
      this.setState({
        redirect: true,
      }) 
    }

  };
  render(){
    if(Session.get("logged") == true){      
      return(<Redirect push to={`http://localhost/giorgio`}/>)
    }
    
    return (
      <div className="site-card-border-less-wrapper">
        <Card title="Login" bordered={false} style={{ width: 300 }}>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.onFinish}
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
  }
};