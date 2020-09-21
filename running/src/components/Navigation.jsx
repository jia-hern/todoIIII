import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";

class Navigation extends Component {
  render() {
    return (
      <Nav>
        {this.props.user ? (
          <React.Fragment>
            <Nav.Link href="#user">{this.props.user.phone}</Nav.Link>
            <Link to="/logout" className="nav-link" onClick={this.props.logout}>
              Logout
            </Link>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </Button>
            <Button>
              <Link to="/register" className="navlink">
                Register
              </Link>
            </Button>
          </React.Fragment>
        )}
      </Nav>
    );
  }
}
export default Navigation;
