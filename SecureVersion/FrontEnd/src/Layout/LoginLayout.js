import React from "react"
import { Row, Col } from 'antd';

export default function LoginLayout(props){
  return(
    <Row>
      <Col style={{marginTop: 150, paddingLeft: '25%'}} span={1} offset={1}>{props.login}</Col>
    </Row>
  )
}
