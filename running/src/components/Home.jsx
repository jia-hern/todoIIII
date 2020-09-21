import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <h1>Todo list</h1>
        {/* this sections displays all todos in the list  */}
        {this.props.list.map((item, i) => (
          <div key={i}>
            {/* {item[1] ? ( */}
            {item.editing ? (
              <input
                name="editbox"
                type="text"
                value={this.props.editbox}
                onChange={this.handleChange}
              />
            ) : (
              // item[0]
              item.todo_text
            )}
            {/* hide delete button when editting to prevent accidental deletion during editing  */}
            {!item.editing && (
              // {!item[1] && (
              <button onClick={() => this.props.handleDelete(i)}>Delete</button>
            )}
            {/* to hide the edit button when editting  */}
            {!item.editing && (
              // {!item[1] && (
              <button onClick={() => this.props.handleEdit(i)}>Edit</button>
            )}
            {/* to show the confirm edit button after clicking edit*/}
            {item.edited && (
              // {item[2] && (
              <button onClick={() => this.props.submitEdit(i)}>
                Confirm edit
              </button>
            )}
          </div>
        ))}

        {/* this section allows addition of a new todo  */}
        <h3>Add a new todo</h3>
        <form onSubmit={this.props.handleSubmit}>
          <label>
            Write a new todo...
            <input
              name="textbox"
              type="text"
              value={this.props.textbox}
              onChange={this.props.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </React.Fragment>
    );
  }
}

export default Home;
