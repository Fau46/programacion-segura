import React from "react"
import AdminHomeCard from "../Components/AdminHomeCard"
import LoginLayout from "../Layout/LoginLayout"
import Session from "../Session/Session"
import { Redirect } from "react-router-dom"

export default class AdminHome extends React.Component{
  redirect = () =>{
    return <Redirect push to={"/home"}/>
  }

  render(){
    const session = Session.get("is_admin");

    return(
      <LoginLayout login={
        <div>
          {session == 1 ? <AdminHomeCard title={this.props.title}/> : this.redirect()}
        </div>
        }
      />
    )
  }
  
}