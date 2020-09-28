import React, { Component } from "react";
import { Col, Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";

class Home extends Component {
  state = {
    list: [],
  };
  fetchItems = () => {
    let token = localStorage.getItem("token");
    Axios.get("http://localhost:3100/todos", {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => {
        this.setState({ list: res.data.list });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  deleteItem = (e) => {
    Axios.delete(`http://localhost:3100/todos/${e.target.id}`).then((res) => {
      this.fetchItems();
    });
  };
  componentDidMount() {
    this.fetchItems();
  }
  render() {
    return (
      <Container fluid>
        <h1>Home</h1>
        {this.state.list.map((item) => (
          <Col key={item._id} md="3" className="mb-3">
            <Card>
              {item.todo_text}
              <div>
                <Link to={`/todos/${item._id}`}>See Todo</Link>
                <Button
                  onClick={this.deleteItem}
                  variant="danger"
                  id={item._id}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Container>
    );
  }
}

export default Home;
