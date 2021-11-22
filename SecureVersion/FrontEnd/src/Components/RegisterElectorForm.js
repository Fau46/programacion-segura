import React from "react"
import { Form, Input, Button, Modal, Card, DatePicker } from 'antd';
import Session from "../Session/Session";
import {  Redirect } from 'react-router-dom';

export default class RegisterElectorForm extends React.Component{

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
    

    if(call.status == 201){
      Modal.success({
        title: 'Success',
        content: values.firstname+" "+values.lastname+" has been registered",
      });
    }
    else{
      Modal.error({
        title: 'Error',
        content: response.detail,
      });
    }
  };

  render(){
    if(Session.get("is_admin") != 1){
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
              label="Firstname"
              name="firstname"
              rules={[{ required: true, message: 'Please input your firstname!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Lastname"
              name="lastname"
              rules={[{ required: true, message: 'Please input your lastname!' }]}
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
              label="Birthday"
              name="dateofbirth"
              rules={[{ required: true, message: 'Please input your birthday!' }]}
            >
              <DatePicker />
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