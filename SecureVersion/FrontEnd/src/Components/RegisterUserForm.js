import React from "react"
import { Form, Input, Button, Modal, Card } from 'antd';
import Session from "../Session/Session";
import {  Redirect } from 'react-router-dom';

export default class RegisterUserForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      redirect: false,
    }

    this.onFinish = this.onFinish.bind(this);
  }
  
   async onFinish (values){ 
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        "Auth-Token" : Session.get("auth_token") 
      },
      body: JSON.stringify(values)
    };

    var call = await fetch(this.props.url+"/"+this.props.endpoint, requestOptions);
    var response = await call.json();
    
    if(call.status == 200){
      Session.set(response[0])
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
    if(this.state.redirect == true || Session.get("dni") != undefined){
      return(<Redirect push to={`/home`}/>)
    }

    return (
      <div className="site-card-border-less-wrapper">
        <Card title={this.props.title} bordered={false} style={{ width: 300 }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="DNI"
              name="dni"
              rules={[{ required: true, message: 'Please input your dni!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>        

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
};