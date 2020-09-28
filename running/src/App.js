import React, { Component } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Axios from "axios";
import { decode } from "jsonwebtoken";
import Navigation from "./components/Navigation";
import { Alert } from "react-bootstrap";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import AddItem from "./components/AddItem";
import Item from "./components/Item";
import PrivateRoute from "./components/PrivateRoute";

class App extends Component {
  state = {
    list: [],
    // errorMessage: null,
    isAuth: false,
    user: null,
  };

  getUserProfile = (token) => {
    Axios.get(
      "http://localhost:3100/auth/user",
      //retrieve the user we saved in the db based on the token we have in the header
      {
        headers: {
          "x-auth-token": token,
        },
      }
    )
      .then((res) => {
        // console.log("This is res.data from getUserProfile", res.data);
        this.setState({
          //to toggle away from login page and back to login back depending if logged in
          isAuth: true,
          //to display the name of user on browser in the navbar
          user: res.data.user,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loginHandler = (credentials) => {
    Axios.post("http://localhost:3100/auth/login", credentials)
      .then((res) => {
        console.log("This is in res.data of loginHandler", res.data);
        localStorage.setItem("token", res.data.token);
        //to get updated info on the user
        this.getUserProfile(res.data.token);
        this.setState({
          isAuth: true,
        });
      })
      .catch((err) => {
        this.setState({
          isAuth: false,
          // errorMessage: err.response.data.message,
        });
      });
  };
  registerHandler = (credentials) => {
    Axios.post("http://localhost:3100/auth/register", credentials)
      .then((res) => {
        console.log("This is in res.data of registerHandler", res.data);
        localStorage.setItem("token", res.data.token);
        this.setState({
          isAuth: true,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isAuth: false });
      });
  };

  logoutHandler = (e) => {
    e.preventDefault();
    console.log("user is logged out");
    this.setState({
      list: [],
      errorMessage: null,
      isAuth: false,
      user: null,
    });
    localStorage.removeItem("token");
  };
  componentDidMount() {
    //the token stuff for authentication
    let token = localStorage.getItem("token");
    if (!(token == null)) {
      let decodedToken = decode(token);
      if (!decodedToken) {
        localStorage.removeItem("token");
      } else {
        this.getUserProfile(token);
      }
    }
  }
  render() {
    //we can use this line so that we do not need to write this.state infront of isAuth,user and errorMessage:
    // let { isAuth, user, errorMessage } = this.state;
    let { isAuth, user } = this.state;
    // console.log(this.state);
    return (
      <Router>
        <Navigation user={user} logout={this.logoutHandler} />
        {/* {errorMessage && <Alert>{errorMessage}</Alert>} */}
        <Switch>
          <PrivateRoute exact path="/" isAuth={isAuth} component={Home} />
          {/* <Route
            exact
            path="/"
            render={() => (isAuth ? <Home /> : <Redirect to="/login" />)}
          /> */}
          <PrivateRoute
            exact
            path="todo/:id"
            isAuth={isAuth}
            component={Item}
          />
          {/* <Route
            path="todo/:id"
            exact
            render={() => (isAuth ? <Item /> : <Redirect to="/login" />)}
          /> */}

          <Route
            path="/todo/add"
            exact
            render={() => (isAuth ? <AddItem /> : <Redirect to="/login" />)}
          />

          <Route
            exact
            path="/login"
            render={() =>
              isAuth ? <Redirect to="/" /> : <Login login={this.loginHandler} />
            }
          />

          <Route
            exact
            path="/register"
            render={() =>
              isAuth ? (
                <Redirect to="/" />
              ) : (
                <Register register={this.registerHandler} />
              )
            }
          />
        </Switch>
      </Router>
    );
  }
}
export default App;
