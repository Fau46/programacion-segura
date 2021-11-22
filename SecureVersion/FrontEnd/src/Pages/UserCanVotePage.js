import React from "react";
import UserCanVoteForm from "../Components/UserCanVoteForm";

import LoginLayout from "../Layout/LoginLayout"



export default function UserCanVotePage(props){
  return(
      <LoginLayout login={<UserCanVoteForm  url={props.url} endpoint={props.endpoint} title={props.title}/>} />
  )
}