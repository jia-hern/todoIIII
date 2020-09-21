import React, { Component } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import axios from "axios";
import Axios from "axios";
import { decode } from "jsonwebtoken";
import Navigation from "./components/Navigation";
import { Alert } from "react-bootstrap";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

class App extends Component {
  state = {
    list: [],
    textbox: "",
    editbox: "",
    //for authentication
    errorMessage: null,
    isAuth: false,
    user: null,
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    // this.setState({ textbox: event.target.value });
    // this.setState({ editbox: event.target.value });
  };
  // handleEditBox = (event) => {
  //   this.setState({ editbox: event.target.value });
  // };
  handleSubmit = (event) => {
    event.preventDefault();
    let temp = { ...this.state };
    let newTodo = {
      todo_text: this.state.textbox,
      editing: false,
      edited: false,
    };
    temp.list.push(newTodo);
    this.setState(temp);
    //update the backend
    axios
      .post("http://localhost:3100/todos/add", newTodo)
      .then((res) => console.log(res.data));
    //update the frontend for the newly created item to have the ._id field
    //alternatively we can just setState for the item that added so that it has the ._id field
    axios
      .get("http://localhost:3100/todos/")
      .then((res) => {
        this.setState({ list: res.data });
        // console.log("This is in res.data", res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  handleEdit = (id) => {
    //to prefill the editbox to have the previous info that was stored
    this.setState({ editbox: this.state.list[id].text });
    let templist = [...this.state.list];
    //to display the form & hide original edit button
    templist[id].editing = true;
    // to "reset any other todos that have the forms open"
    for (let index = 0; index < templist.length; index++) {
      if (index !== id) {
        templist[index].editing = false;
        templist[index].edited = false;
      }
    }
    this.setState({ list: templist });
    //to show the confirm edit button
    templist[id].edited = true;
  };
  // use the editing in state as a switch to display the edit form
  submitEdit = (id) => {
    //https://stackoverflow.com/questions/55149022/how-to-create-an-edit-button-in-react
    let templist = [...this.state.list];
    //to hide the form
    templist[id].editing = false;
    //to hide the confirm edit button
    templist[id].edited = false;
    templist[id].todo_text = this.state.editbox;
    this.setState({ list: templist });

    //update the backend so that db has updated info of the ameneded todo
    //need to pass in the id so we use backticks
    let identity = templist[id]._id;
    axios
      .post(`http://localhost:3100/todos/update/${identity}`, templist[id])
      .then((res) => {
        console.log("This is res.data from /update", res.data);
      })
      //same as:
      // }).catch(function(error){
      .catch((error) => {
        console.log(error);
      });
  };

  handleDelete = (id) => {
    let templist = [...this.state.list];
    //update the backend
    let identity = templist[id]._id;
    axios
      .delete(`http://localhost:3100/todos/${identity}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //shifted below the axios call or not cannot find id to assign ._id to the identity
    templist.splice(id, 1);
    this.setState({ list: templist });
  };

  /*The getuserprofile, loginhandler, registerhandle and logout handler does the authentication*/
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
        console.log("This is res.data from getUserProfile", res.data);
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
          errorMessage: err.response.data.message,
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
      textbox: "",
      editbox: "",
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

    //retrieve all the todos that is currently stored in the db
    axios
      .get("http://localhost:3100/todos/")
      .then((res) => {
        this.setState({ list: res.data });
        // console.log("This is in res.data", res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    //we can use this line so that we do not need to write this.state infront of isAuth,user and errorMessage:
    let { isAuth, user, errorMessage } = this.state;
    console.log(this.state);
    return (
      <Router>
        <Navigation user={user} logout={this.logoutHandler} />
        {errorMessage && <Alert>{errorMessage}</Alert>}
        <Switch>
          {/* <PrivateRoute
            exact
            path="/"
            render={() => (
              <Home
                isAuth={isAuth}
                handleDelete={this.handleDelete}
                handleEdit={this.handleEdit}
                submitEdit={this.submitEdit}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
              />
            )}
          /> */}
          <Route
            exact
            path="/"
            render={() =>
              isAuth ? (
                <Home
                  handleDelete={this.handleDelete}
                  handleEdit={this.handleEdit}
                  submitEdit={this.submitEdit}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
                  list={this.state.list}
                  textbox={this.state.textbox}
                  editbox={this.state.editbox}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />

          <Route
            exact
            path="/login"
            // render={() => <Login login={this.loginHandler} isAuth={isAuth} />}
            render={() =>
              isAuth ? <Redirect to="/" /> : <Login login={this.loginHandler} />
            }
          />

          <Route
            exact
            path="/register"
            // render={() => (
            //   <Register register={this.registerHandler} isAuth={isAuth} />
            // )}
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
