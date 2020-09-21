import React, { Component } from "react";
import { Row, Form, Button, Container } from "react-bootstrap";

export default class Register extends Component {
  state = {
    phone: "",
    password: "",
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  registerHandler = () => {
    this.props.register(this.state);
  };
  render() {
    return (
      <div>
        <h1>Register</h1>
        <div>
          <Container>
            <Row>
              <Form.Control name="phone" onChange={this.changeHandler} />
            </Row>
            <Row>
              <Form.Control name="password" onChange={this.changeHandler} />
            </Row>
            <Button onClick={this.registerHandler}>Register</Button>
          </Container>
        </div>
      </div>
    );
  }
}
