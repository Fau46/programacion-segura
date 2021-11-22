import React from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Layout from "./Layout/MainLayout"
import AdminHome from "./Pages/AdminHomePage";
import CandidatesPage from "./Pages/CandiatesPage";
import CommentsPage from "./Pages/CommentsPage";
import Login from "./Pages/LoginPage"
import RegisterElector from "./Pages/RegisterElectorPage";
import RegisterUser from "./Pages/RegisterUserPage"
import UserCanVotePage from "./Pages/UserCanVotePage";
import UserHome from "./Pages/UserHomePage";
import Session from "./Session/Session";

const URL_base = "http://localhost"
const URL_electors = URL_base+":42424"
const URL_elections = URL_base+":42423"
const URL_comments = URL_base+":42425"

export default class RouterPages extends React.Component{ 
  
  render(){
    
    return(
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route path="/login" render={() => <Login url={URL_electors} endpoint={"check_credentials"} title={"Login"}/>} />
            <Route path="/register/user" render={() => <RegisterUser url={URL_electors} endpoint={"users"} title={"User Registration"}/>} />
            <Route path="/admin/home" render={() => <AdminHome title={"Welcome "+Session.get("username")}/>} />
            <Route path="/admin/user/can_vote" render={() => <UserCanVotePage url={URL_electors} endpoint={"users/{dni}/vote"} title={"Elector voting right"}/>} />
            <Route path="/admin/register/elector" render={() => <RegisterElector url={URL_electors} endpoint={"electors"} title={"Elector Registration"}/>} />
            <Route path="/candidates" render={() => <CandidatesPage url={URL_elections} endpoint={"candidates"}/>} />
            <Route path="/comments" render={() => <CommentsPage url={URL_comments} endpoint={"comments"}/>} />
            <Route path="/home" render={() => <UserHome title={"Welcome "+Session.get("username")}/>} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}