import React from "react";
import RegisterUserForm from "../Components/RegisterUserForm"
import LoginLayout from "../Layout/LoginLayout"



export default function RegisterUser(props){
  return(
      <LoginLayout login={<RegisterUserForm  url={props.url} endpoint={props.endpoint} title={props.title}/>} />
  )
}