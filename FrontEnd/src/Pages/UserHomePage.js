import React from "react"
import AdminHomeCard from "../Components/AdminHomeCard"
import LoginLayout from "../Layout/LoginLayout"
import Session from "../Session/Session"
import { Redirect } from "react-router-dom"
import UserHomeCard from "../Components/UserHomeCard"

export default class UserHome extends React.Component{
  redirect = () =>{
    return <Redirect push to={"/login"}/>
  }

  render(){
    const dni = Session.get("dni");
    const is_admin = Session.get("is_admin");
    console.log(dni+" "+is_admin)
    return(
      <LoginLayout login={
        <div>
          {is_admin == 0 && dni != undefined ? <UserHomeCard title={this.props.title}/> : this.redirect()}
        </div>
        }
      />
    )
  }
  
}