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
    console.log(dni+" "+is_admin)
    return(
      <LoginLayout login={
        <div>
          {is_admin == 0 && dni != undefined ? <CandidatesCard title={this.props.title}/> : this.redirect()}
        </div>
        }
      />
    )
  }
  
}