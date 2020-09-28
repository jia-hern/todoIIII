import React, { Component } from "react";
import { Row, Form, Button } from "react-bootstrap";

class EditItem extends Component {
  state = {
    todo_text: this.props.item.todo_text,
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = () => {
    this.props.editItem(this.state, this.props.item._id);
  };
  render() {
    let todo_text = this.state;
    return (
      <div>
        <h1>Edit Item</h1>
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
export default EditItem;
