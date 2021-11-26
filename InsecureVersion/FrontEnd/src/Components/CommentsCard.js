import React from 'react';
import { Modal, List, Form, Avatar, Button, Input, Card, Comment } from 'antd';
import Session from '../Session/Session';

const { TextArea } = Input;

const createMarkup = (value) => {
  return {
    __html: value,
  };
};

const Editor = ({ onSubmit, onChange, value }) =>{

  return(
    <>
      <Form.Item>
        <TextArea rows={4}  onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" onClick={onSubmit} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  )
}

export default class CommentsCard extends React.Component{
  constructor(props){
    super(props)
    this.state={
      data: [],
      value: '',
      test: 0
    }

    this.onChange = this.onChange.bind(this)
    this.newComment = this.newComment.bind(this)
    this.displayNewComment = this.displayNewComment.bind(this);
  }

  async componentDidMount(){
    var call = await fetch(this.props.url+"/"+this.props.endpoint);
    var response = await call.json();
    this.setState({data: response})
    
  }
  

  listComments(){
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
                avatar={<Avatar src={"https://avatars.dicebear.com/api/adventurer/"+item.id+".svg"} />}
                title={<a href="https://ant.design">{item.author}</a>}
                // description={item.text}
                description={
                  <div dangerouslySetInnerHTML={createMarkup(item.text)} />
                }
              />
              
            </List.Item>
          )}
        />
      </div>
    );
  }
  

  onChange(e){
    this.setState({
      value: e.target.value,
    })
  }


  displayNewComment(comment){
    var comments_data = this.state.data;
    comments_data.push(comment)

    this.setState({
      data: comments_data
    })
  }


  async newComment(){
    if(this.state.value == ""){
      return
    }

    const comm= {
      "author": Session.get("username"),
      id: Session.get("id"),
      text: this.state.value
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comm)
    };


    var call = await fetch(this.props.url+"/"+this.props.endpoint, requestOptions);
    var response = await call.json();
    
    if(call.status != 500){
      this.displayNewComment(comm)
    }
    else{
      Modal.error({
        title: 'Error',
        content: response.detail,
      });
    }
  }

  render(){
    return(
      <Card title={this.props.title} bordered={false} style={{ width: 500 }}
        actions={[
          <Comment
          avatar={<Avatar src={"https://avatars.dicebear.com/api/adventurer/ciao.svg"} alt="Han Solo" />}
          content={
            <Editor
              onSubmit={this.newComment}
              onChange={this.onChange}
              valute={this.state.value}
            />
          }
          style={{margin: 20}}
          />
        ]}
      >
        {this.listComments()}
      </Card>
    )
  }
  
  
};

