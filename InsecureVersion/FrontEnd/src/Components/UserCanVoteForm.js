import React from "react"
import { Form, Input, Button, Modal, Card, DatePicker, Select } from 'antd';
import Session from "../Session/Session";
import {  Redirect } from 'react-router-dom';

const { Option } = Select;

export default class UserCanVoteForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      redirect: false,
    }

    this.onFinish = this.onFinish.bind(this);
  }
  
   async onFinish (values){ 

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    };

    var endpoint = this.props.endpoint.replace("{dni}", values.dni)

    var call = await fetch(this.props.url+"/"+endpoint+"?allowed="+values.allowed, requestOptions);
    var response = await call.json();
    

    if(call.status == 200){
      Modal.success({
        title: 'Success',
        content: "User's voting right modified",
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
        <Card title={this.props.title} bordered={false} style={{ width: 350 }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="DNI"
              name="dni"
              rules={[{ required: true, message: 'Please input your dni!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Voting right"
              name="allowed"
              rules={[{ required: true, message: 'Please input voting right!' }]}
            >
              <Select className="select-after">
                <Option value={true}>Can Vote</Option>
                <Option value={false}>Cannot Vote</Option>
              </Select>
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