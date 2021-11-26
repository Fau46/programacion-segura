import { Space, Card, Button } from 'antd';
import { DownloadOutlined, EditOutlined, UnorderedListOutlined, MessageOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import React from 'react';

export default class UserHomeCard extends React.Component{  
  constructor(props){
    super(props);
    this.state={
      redirect: ""
    }
  }

  redirect(page){
    this.setState({
      redirect: page
    })
  }

  render(){
    
    if(this.state.redirect != ""){
      return <Redirect push to={this.state.redirect}/>
    }

    return(
      <div className="site-card-border-less-wrapper">
          <Card title={this.props.title} bordered={false} style={{ width: 300 }}>
            <Space direction="vertical">
              
              <Button type="primary" icon={<EditOutlined />} onClick={() => this.redirect("/candidates")}>
                Vote
              </Button>

              <Button type="primary" icon={<UnorderedListOutlined />} onClick={() => this.redirect("/results")}>
                Results
              </Button>

              <Button type="primary" icon={<MessageOutlined />} onClick={() => this.redirect("/comments")}>
                Comments
              </Button>
            </Space>
          </Card>
      </div>

    )
  }

}