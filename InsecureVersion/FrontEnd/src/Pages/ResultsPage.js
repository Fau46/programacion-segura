import React from "react"
import Session from "../Session/Session"
import { Redirect } from "react-router-dom"
import ResultCard from "../Components/ResultsCard"
import LoginLayout from "../Layout/LoginLayout"

export default class ResultPage extends React.Component{
  redirect = () =>{
    return <Redirect push to={"/login"}/>
  }

  render(){
    const dni = Session.get("dni");
    const is_admin = Session.get("is_admin");
    
    return(
      <LoginLayout login={
        <div>
          {is_admin == 0 && dni != undefined ? <ResultCard url={this.props.url} endpoint={this.props.endpoint} title={this.props.title}/> : this.redirect()}
        </div>
      }/>
    )
  }
  
}