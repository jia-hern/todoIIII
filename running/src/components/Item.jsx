import React, { Component } from "react";
import Axios from "axios";
import { Container, Button } from "react-bootstrap";
import EditItem from "./EditItem";

class Item extends Component {
  state = {
    item: null,
    edit: false,
  };
  showEdit = () => {
    //set state of edit to be opposite of its previous state
    this.setState((prevState) => ({ edit: !prevState.edit }));
  };
  editItems = (obj, id) => {
    Axios.post(`http://localhost:3100/todos/update/${id}`, obj)
      .then((res) => {
        this.getItem();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getItem = () => {
    Axios.get(`http://localhost:3100/todos/${this.props.match.params.id}`)
      .then((res) => {
        this.setState({ item: res.data.item });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    this.getItem();
  }
  render() {
    let { item, edit } = this.state;
    return (
      <Container>
        <h1>Single Todo</h1>
        {item ? (
          <div>
            {item.text}
            <Button onClick={this.showEdit}>Edit Item</Button>
            {edit && <EditItem item={item} editItem={this.EditItems} />}
          </div>
        ) : (
          "There is no todo!"
        )}
      </Container>
    );
  }
}
export default Item;
