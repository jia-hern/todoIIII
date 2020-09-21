import React, { Component } from "react";
import { Row, Form, Button, Container } from "react-bootstrap";

export default class Login extends Component {
  state = {
    phone: "",
    password: "",
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  // loginHandler = () => {
  //   this.props.login(this.state);
  // };
  render() {
    return (
      <div>
        <h1>Login</h1>
        <div>
          <Container>
            <Row>
              <Form.Control name="phone" onChange={this.changeHandler} />
            </Row>
            <Row>
              <Form.Control name="password" onChange={this.changeHandler} />
            </Row>
            <Button onClick={this.props.login(this.state)}>Login</Button>
          </Container>
        </div>
      </div>
    );
  }
}
