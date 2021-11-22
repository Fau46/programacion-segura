import React from "react"
import LoginLayout from "../Layout/LoginLayout"
import Session from "../Session/Session"
import { Redirect } from "react-router-dom"
import UserHomeCard from "../Components/UserHomeCard"
import CandidatesCard from "../Components/CandidatesCards"

export default class CandidatesPage extends React.Component{
  redirect = () =>{
    return <Redirect push to={"/login"}/>
  }

  render(){
    const dni = Session.get("dni");
    const is_admin = Session.get("is_admin");
    
    return(
      <div>
        {is_admin == 0 && dni != undefined ? <CandidatesCard url={this.props.url} endpoint={this.props.endpoint}/> : this.redirect()}
      </div>
    )
  }
  
}