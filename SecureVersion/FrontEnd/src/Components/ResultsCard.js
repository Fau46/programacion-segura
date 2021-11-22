import React from "react"
import Session from "../Session/Session";
import { List, Avatar, Card } from 'antd';
import { Redirect } from "react-router-dom"



export default class ResultCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      results: [],
      redirect: false
    }
  }
  
  async componentDidMount(){
  const requestOptions = {
      headers: { 
        "Auth-Token" : Session.get("auth_token") 
      },
      
    };

    var call = await fetch(this.props.url+"/"+this.props.endpoint, requestOptions);
    var response = await call.json();

    if(call.status == 200){
      response.sort((a,b) => {
      
        return -(a[1] - b[1])
      })
      console.log(response)
      this.setState({data: response})
    }
    else{
      this.setState({
        redirect: true,
      })
    }
    
  }

  listCandidates(){
    return (
      <div
        id="scrollableDiv"
        style={{
          height: 200,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <List
          dataSource={this.state.data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={"https://avatars.dicebear.com/api/adventurer/"+item[0].id+".svg"} />}
                title={<a href="https://ant.design">{item[0].firstname+" "+item[0].lastname}</a>}
                description={"Party: "+item[0].party+" | Votes: "+item[1]}
              />
              
            </List.Item>
          )}
        />
      </div>
    );
  }


  render(){
    if(this.state.redirect){
      return <Redirect push to={"/login"}/>
    }

    return(
      <Card title={this.props.title} bordered={false} style={{ width: 500 }}>
        {this.listCandidates()}
      </Card>
    )
  }
}