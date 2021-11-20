import React from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Layout from "./Layout/MainLayout"
import Login from "./Pages/LoginPage"
import Session from "react-session-api";

const URL = "http://localhost:42424"

export default class RouterPages extends React.Component{  
  render(){
    Session.set("logged",false);
    return(
      <Router>
        <Layout>
          <Switch>
          <Route exact path="/" render={() => <Redirect to="/giorgio" />} />
            <Route path="/login" render={() => <Login url={URL} endpoint={"check_credentials"}/>} />
            <Route path="/giorgio" render={() => <div>Ciao giorgio</div>} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}