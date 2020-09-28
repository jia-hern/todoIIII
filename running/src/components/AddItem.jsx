import React, { Component } from "react";
import { Button, Form, Row } from "react-bootstrap";
import Axios from "axios";
import { Redirect } from "react-router-dom";

class AddItem extends Component {
  state = {
    todo_text: "",
    status: false,
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = () => {
    Axios.post("http://localhost:3100/todos/add", this.state)
      .then((res) => {
        this.setState({ status: true });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let { todo_text } = this.state;

    if (this.state.status) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h1>Add Todo</h1>
        <Row>
          <Form.Control
            name="todo_text"
            value={todo_text}
            onChange={this.changeHandler}
          />
        </Row>
        <Button onClick={this.submitHandler}>Submit</Button>
      </div>
    );
  }
}
export default AddItem;
