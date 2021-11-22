import React from "react"
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Session from "../Session/Session";
import { Redirect } from 'react-router-dom';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class MainLayout extends React.Component {
  constructor(props){
    super(props);
    this.state={
      redirect: "",
      items: undefined
    }
  }
  
  state = {
    collapsed: false,
  };

  componentDidMount(){
    setInterval(() => {
      if(Session.get("is_admin") == 1){
        var aux = this.adminItems()
        this.setState({items: aux})
      }
      else if(Session.get("is_admin") == 0){
        var aux = this.userItems()
        this.setState({items: aux})
      }
      else if(this.state.items != undefined){
        this.setState({items: undefined})
      }
    }, 500);
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  redirect(page){
    console.log(page)
    this.setState({
      redirect: page
    })
  }

  adminItems(){
    return(
      <>
        <Menu.Item key="20" icon={<UserOutlined />}>
            {Session.get("username")}
        </Menu.Item>
        <Menu.Item key="200" icon={<DesktopOutlined />} onClick={() => this.redirect("/admin/home")}>
            Home
        </Menu.Item>
        <Menu.Item key="21" icon={<LogoutOutlined />} onClick={
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
      </>
    )
  }
  
  userItems(){
    return(
      <>
        <Menu.Item key="20" icon={<UserOutlined />}>
            {Session.get("username")}
        </Menu.Item>
        <Menu.Item key="200" icon={<DesktopOutlined />} onClick={() => this.redirect("/home")}>
            Home
        </Menu.Item>
        <Menu.Item key="21" icon={<LogoutOutlined />} onClick={
          () => {
            Session.clear()
            this.redirect("/login")
          }}>
          Logout
        </Menu.Item>
        <SubMenu key="sub1" icon={<TeamOutlined />} title="Elections">
          <Menu.Item key="3" onClick={() => this.redirect("/candidates")}>
            Vote
          </Menu.Item>
          <Menu.Item key="4" onClick={() => this.redirect("/comments")}>
            Comments
          </Menu.Item>
        </SubMenu>
      </>
    )
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
            {this.state.items}
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