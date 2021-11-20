import React from "react";
import { Card } from 'antd';
import LoginForm from "../Components/LoginForm"
import LoginLayout from "../Layout/LoginLayout"



export default function Login(props){
  return(
      <LoginLayout login={<LoginForm  url={props.url} endpoint={props.endpoint}/>} />
  )
}