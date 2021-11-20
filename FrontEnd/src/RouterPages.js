import React from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Layout from "./Layout/MainLayout"
import Login from "./Pages/LoginPage"

// const {Switch, Router, Route, Redirect} = BrowserRouter;

export default class RouterPages extends React.Component{

  render(){
    return(
      <Router>
        <Layout>
          <Switch>
          <Route exact path="/" render={() => <Redirect to="/giorgio" />} />
            <Route path="/login" render={() => <Login />} />
            <Route path="/giorgio" render={() => <div>Ciao giorgio</div>} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}