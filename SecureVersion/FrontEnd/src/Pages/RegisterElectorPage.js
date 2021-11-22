import React from "react";
import RegisterElectorForm from "../Components/RegisterElectorForm"
import LoginLayout from "../Layout/LoginLayout"



export default function RegisterElector(props){
  return(
      <LoginLayout login={<RegisterElectorForm  url={props.url} endpoint={props.endpoint} title={props.title}/>} />
  )
}