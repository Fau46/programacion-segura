import React from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Layout from "./Layout/MainLayout"
import AdminHome from "./Pages/AdminHomePage";
import CandidatesPage from "./Pages/CandiatesPage";
import Login from "./Pages/LoginPage"
import RegisterElector from "./Pages/RegisterElectorPage";
import RegisterUser from "./Pages/RegisterUserPage"
import UserCanVotePage from "./Pages/UserCanVotePage";
import UserHome from "./Pages/UserHomePage";


const URL_electors = "http://localhost:42424"

export default class RouterPages extends React.Component{ 
  
  render(){
    
    return(
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route path="/login" render={() => <Login url={URL_electors} endpoint={"check_credentials"} title={"Login"}/>} />
            <Route path="/register/user" render={() => <RegisterUser url={URL_electors} endpoint={"users"} title={"User Registration"}/>} />
            <Route path="/admin/home" render={() => <AdminHome title="Welcome"/>} />
            <Route path="/admin/user/can_vote" render={() => <UserCanVotePage url={URL_electors} endpoint={"users/{dni}/vote"} title={"Elector voting right"}/>} />
            <Route path="/admin/register/elector" render={() => <RegisterElector url={URL_electors} endpoint={"electors"} title={"Elector Registration"}/>} />
            <Route path="/candiates" render={() => <CandidatesPage url={URL_electors} endpoint={"electors"} title={"Elector Registration"}/>} />
            <Route path="/home" render={() => <UserHome title="Welcome"/>} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}