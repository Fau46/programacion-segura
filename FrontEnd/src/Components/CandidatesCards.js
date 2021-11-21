import React from "react";

export default class CandidatesCard extends React.Component{
  constructor(props){
    super(props)
    this.state={
      candiate: ""
    }

    this.fetchCandidates = this.fetchCandidates.bind(this);
  }

  async fetchCandidates(){
    var call = await fetch(this.props.url+"/"+this.props.endpoint);
    var response = await call.json();
    console.log(response)
  }

  render(){
    if(this.state.candiate == "") this.fetchCandidates(); 
    
    return(
    this.state.candidate == "" ? (<div>ciao</div>) : (<div>mondo</div>)
    )
  }

}