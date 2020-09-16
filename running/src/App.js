import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  state = {
    // list: ["one", "two"],
    list: [
      // to save info in this format
      // { todo_text: "one", editing: false, edited: false },
      // { todo_text: "two", editing: false, edited: false },
      // ["one", false, false],
      // ["two", false, false],
    ],
    textbox: "",
    editbox: "",
  };
  handleChange = (event) => {
    this.setState({ textbox: event.target.value });
  };
  handleEditBox = (event) => {
    this.setState({ editbox: event.target.value });
  };
  handleSubmit = (event) => {
    // to test that basic submit works
    // alert("A new todo is to be added:" + this.state.textbox);
    // prevents the page from being refreshed on button submission, which is the default button behavior
    event.preventDefault();
    let temp = { ...this.state };
    // temp.list.push([this.state.textbox, false, false]);
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
    /* to do something like that: <button onClick={() 
      => (this.setState({list[i][1] = true}))}>Edit</button> */
    let templist = [...this.state.list];
    //to display the form & hide original edit button
    // templist[id][1] = true;
    templist[id].editing = true;
    // to "reset any other todos that have the forms open"
    for (let index = 0; index < templist.length; index++) {
      if (index !== id) {
        // templist[index][1] = false;
        templist[index].editing = false;
        // templist[index][2] = false;
        templist[index].edited = false;
      }
    }
    //dk why the next line dont work
    // templist = templist.splice(id, 1, {
    //   todo_text: this.state.list[id].todo_text,
    //   editing: true,
    //   edited: true,
    // });
    this.setState({ list: templist });
    //to show the confirm edit button
    // templist[id][2] = true;
    templist[id].edited = true;
  };
  // use the editing in state as a switch to display the edit form
  submitEdit = (id) => {
    //https://stackoverflow.com/questions/55149022/how-to-create-an-edit-button-in-react
    let templist = [...this.state.list];
    //to hide the form
    // templist[id][1] = false;
    templist[id].editing = false;
    //to hide the confirm edit button
    // templist[id][2] = false;
    templist[id].edited = false;
    // templist[id][0] = this.state.editbox;
    templist[id].todo_text = this.state.editbox;
    this.setState({ list: templist });

    // at position id, remove 1 item and put whats in editbox in its place
    // templist = templist.splice(id, 1, this.state.editbox);
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
  componentDidMount() {
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
    console.log(this.state.list);
    return (
      <React.Fragment>
        <h1>Todo list</h1>
        {/* this sections displays all todos in the list  */}
        {this.state.list.map((item, i) => (
          <div key={i}>
            {/* {item[1] ? ( */}
            {item.editing ? (
              <input
                type="text"
                value={this.state.editbox}
                onChange={this.handleEditBox}
              />
            ) : (
              // item[0]
              item.todo_text
            )}
            {/* hide delete button when editting to prevent accidental deletion during editing  */}
            {!item.editing && (
              // {!item[1] && (
              <button onClick={() => this.handleDelete(i)}>Delete</button>
            )}
            {/* to hide the edit button when editting  */}
            {!item.editing && (
              // {!item[1] && (
              <button onClick={() => this.handleEdit(i)}>Edit</button>
            )}
            {/* to show the confirm edit button after clicking edit*/}
            {item.edited && (
              // {item[2] && (
              <button onClick={() => this.submitEdit(i)}>Confirm edit</button>
            )}
          </div>
        ))}

        {/* this section allows addition of a new todo  */}
        <h3>Add a new todo</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Write a new todo...
            <input
              type="text"
              value={this.state.textbox}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </React.Fragment>
    );
  }
}

export default App;
