import React from "react"
import { Row, Col } from 'antd';

export default function LoginLayout(props){
  return(
    <Row>
      <Col style={{marginTop: 150, paddingLeft: 250}} span={8} offset={6}>{props.login}</Col>
    </Row>
  )
}