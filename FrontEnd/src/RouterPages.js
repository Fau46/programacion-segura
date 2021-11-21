import React from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Layout from "./Layout/MainLayout"
import Login from "./Pages/LoginPage"
import RegisterUser from "./Pages/RegisterUserPage"
import Session from "react-session-api";

const URL = "http://localhost:42424"

export default class RouterPages extends React.Component{  
  render(){
    // Session.set("dni","");
    // Session.set("is_admin",false);

    return(
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/giorgio" />} />
            <Route path="/login" render={() => <Login url={URL} endpoint={"check_credentials"} title={"Login"}/>} />
            <Route path="/register/user" render={() => <RegisterUser url={URL} endpoint={"users"} title={"Registration"}/>} />
            <Route path="/giorgio" render={() => <div>Ciao giorgio</div>} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}