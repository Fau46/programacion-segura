import React from "react"
import LoginLayout from "../Layout/LoginLayout"
import Session from "../Session/Session"
import { Redirect } from "react-router-dom"
import CommentsCard from "../Components/CommentsCard"

export default class CommentsPage extends React.Component{
  redirect = () =>{
    return <Redirect push to={"/login"}/>
  }

  render(){
    const dni = Session.get("dni");
    const is_admin = Session.get("is_admin");
    return(
      <LoginLayout login={
       <div>
          {is_admin == 0 && dni != undefined ? <CommentsCard url={this.props.url} endpoint={this.props.endpoint}/> : this.redirect()}
       </div>
      } />
    )
  }
  
}