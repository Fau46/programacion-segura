import React from "react"
import { Form, Input, Button, Space, Card, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Session from "react-session-api";
import { Redirect } from 'react-router-dom';


export default class LoginForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      redirect: false,
    }

    this.onFinish = this.onFinish.bind(this);
  }
  
   async onFinish (values){ 
    var call = await fetch(this.props.url+"/"+this.props.endpoint+"?username="+values.username+"&password="+values.password);
    var response = await call.json();

    console.log(Session.get("dni"))

    if(call.status == 200){
      Session.set("dni", response[0].dni)
      Session.set("is_admin", response[0].is_admin)
      

      this.setState({
        redirect: true,
      }) 
    }
    else{
      Modal.error({
        title: 'Error',
        content: response.detail,
      });
    }
  };

  render(){
    if(this.state.redirect == true || Session.get("dni") != ""){      
      return(<Redirect push to={`/home`}/>)
    }
    
    return (
      
      <div className="site-card-border-less-wrapper">
        <Card title={this.props.title} bordered={false} style={{ width: 300 }}>
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
                Or <a href="/register/user">register now!</a>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
};