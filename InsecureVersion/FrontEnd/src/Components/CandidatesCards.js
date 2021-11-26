import React from "react";
import { Card, Avatar, Space, Row, Col, Button, Modal } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined,  } from '@ant-design/icons';
import Session from "../Session/Session";

const { Meta } = Card;

export default class CandidatesCard extends React.Component{
  cands = []

  constructor(props){
    super(props)
    this.state = {
      candidates:""
    }
  }
  
  async sendVote(candidate_id){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({candidate_id: candidate_id.toString(), elector_id:Session.get("id")})
    };
    var call = await fetch(this.props.url+"/vote", requestOptions);
    
    if(call.status == 201){
      Modal.success({
        title: "Success",
        content: "Vote registered"
      })
    }
    else{
      Modal.error({
        title: 'Error',
        content: "An error occurred"
      });
    }
  }

  createCards(candidates){
    this.cands=[]

    for(const candidate of candidates){
      this.cands.push(
        <Space>
          <Col className="gutter-row" span={6}>
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="https://d2v9ipibika81v.cloudfront.net/uploads/sites/72/431539-PE9O1K-661-1140x684.jpg"
                />
              }
              actions={[
                // <SettingOutlined key="setting" />,
                <Button type="primary" onClick={() => this.sendVote(candidate.id)}>Vote</Button>
                // <EditOutlined key="edit" />,
                // <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src={"https://avatars.dicebear.com/api/adventurer/"+candidate.firstname+".svg"} />}
                title={candidate.firstname+" "+candidate.lastname}
                description={candidate.party}
              />
            </Card>
          </Col>
        </Space>
      )
    }
  }

  async componentDidMount(){
    var call = await fetch(this.props.url+"/"+this.props.endpoint);
    var response = await call.json();
    this.setState({candidates: response})
  }

  render(){
    // if(this.state.candidates == "" ){
      // this.fetchCandidates()
    // }

    if(this.state.candidates != ""){
     this.createCards(this.state.candidates);
    }
    
    return(
      <Row style={{padding: 50}}gutter={[16, 24]} >
        {this.cands}
      </Row>
    )
  }

}