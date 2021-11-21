import React from "react";
import Session from "../Session/Session";

export default class UserInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      stop: false
    };

    this.queryElector = this.queryElector.bind(this);
    this.queryUser = this.queryUser.bind(this);
  }

  async queryUser(){
    var call = await fetch(this.props.url+"/"+this.props.endpoint.users+"/"+Session.get("dni"));
    var response = await call.json();
    var values = response[0]
    
    Object.keys(values).forEach(key =>{
      this.setState({[key]: values[key]});
    }
    )
    // this.state=values;
  }

  queryElector = async () => {
    var call = await fetch(this.props.url+"/"+this.props.endpoint.electors+"/"+Session.get("dni"));
    var response = await call.json();
    var values = response[0]
    
    Object.keys(values).forEach(key =>{
      this.setState({[key]: values[key]});
    }
    )
  }


  render(){
    console.log(this.state)
    if(this.state.stop == false){
      this.setState({stop:true});
      this.queryUser();
      this.queryElector()
    }

    return(
      <div></div>
    )
  }
}