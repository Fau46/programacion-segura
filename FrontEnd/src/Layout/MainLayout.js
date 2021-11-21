import React from "react"
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Session from "../Session/Session";
import { Redirect } from 'react-router-dom';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class MainLayout extends React.Component {
  constructor(props){
    super(props);
    this.state={
      redirect: ""
    }
  }
  
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  redirect(page){
    console.log(page)
    this.setState({
      redirect: page
    })
  }

  render() {
    if(this.state.redirect != ""){
      this.setState({redirect: ""})
      return <Redirect push to={this.state.redirect}/>
    }

    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="2" icon={<DesktopOutlined />} onClick={
              () => Session.set({
                      "dni": "0",
                      "elector_id": 1,
                      "id": 1,
                      "is_admin": 1,
                      "password": "Admin",
                      "username": "Admin"
            })}>
              Login Admin
            </Menu.Item>
            <Menu.Item key="20" icon={<DesktopOutlined />} onClick={() => this.redirect("/admin/home")}>
              Home
            </Menu.Item>
            <Menu.Item key="21" icon={<DesktopOutlined />} onClick={
              () => {
                Session.clear()
                this.redirect("/login")
              }}>
              Logout
            </Menu.Item>
            <SubMenu key="sub1" icon={<TeamOutlined />} title="Electors">
              <Menu.Item key="3" onClick={() => this.redirect("/admin/register/elector")}>
                Register elector
              </Menu.Item>
              <Menu.Item key="4" onClick={() => this.redirect("/admin/user/can_vote")}>
                Electors vote right
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}