const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
let Todo = require("./models/todo.model");
//PORT and MONGODB can be shifted into .env file
const PORT = 3100;
MONGODB = "mongodb://localhost/todo";
//allows sharing of info to another domain
app.use(cors());
//to read and write json files
app.use(express.json());

//to connect to the database we have on the machine
//1st parameter is where the database is located, 2nd parameter is an object where we can specify the options. 3rd parameter is a callback, returns a promise
mongoose.connect(
  MONGODB,
  {
    //https://mongoosejs.com/docs/deprecations.html
    useCreateIndex: true, // fix deprecation warning if i define indexes in my mongoose schemas
    useNewUrlParser: true, //fix current URL string parser deprecated error
    useUnifiedTopology: true, //fix deprecation warning of server ciscovery and monitor engine
  },
  (err) => {
    if (err) throw err; //display errors is any
    console.log("mongodb connected!"); //to say mongodb is connected if nth wrong
  }
);
//create instance of express router
const todoRoutes = express.Router();
//use router as middleware and handles all requests with path /todos (note /todos is added as a prefix to all other routes built on this)
app.use("/todos", todoRoutes);

//this endpoint delivers all available todos items
/* handle: GET /todos/
   DESC: retrieves all todo items
*/
// todoRoutes.route('/').get(function(req,res){
//     Todo.find(function(err,todos){
//         if(err){
//             console.log(err)
//         }else{
//             res.json(todos)
//         }
//     })
// })
todoRoutes.get("/", async (req, res) => {
  try {
    let todos = await Todo.find();
    // res.json(todos);
    // console.log("this is in the res", todos);
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).send("did not managed to retrieve all todos");
  }
});
//this endpoint retrieves a single todo item by providing an id
/* handle: GET /todos/:id
   DESC: retrieves single todo based on id
*/
// todoRoutes.route("/:id").get(function (req, res) {
//   let id = req.params.id;
//   Todo.findById(id, function (err, todo) {
//     res.json(todo);
//   });
// });
todoRoutes.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let todo = await Todo.findById(id);
    // res.json(todo);
    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).send("Did not managed to get a single todo with this id");
  }
});
//this endpoint allows us to add new todo items
/* handle: POST /todos/add
   DESC: add new todo items
*/
// todoRoutes.route("/add").post(function (req, res) {
// //the new todo is part of the HTTP POST request body => so can be accessed via req.body
//   let todo = new Todo(req.body);
//   todo
//     .save()
//     .then((todo) => {
//       res.status(200).json({ todo: "todo added successfully" });
//     })
//     .catch((err) => {
//       res.status(400).send("adding a new todo failed");
//     });
// });
todoRoutes.post("/add", async (req, res) => {
  try {
    let todo = new Todo(req.body);
    todo.save();
    if (todo) {
      // console.log("This is in req of /add", req);
      // console.log("This is in res /add", res);
      res.status(201).send("Todo was added successfully");
    }
  } catch (error) {
    res.status(400).send("adding a new todo failed");
  }
});
//this endpoint allows us to update an existing todo item
/* handle: POST /todos/update/:id
   DESC: update an existing todo item
*/
// todoRoutes.route("/update/:id").post(function (req, res) {
//   Todo.findById(req.params.id, function (err, todo) {
//     if (!todo) {
//       res.status(404).send("data is not found");
//     } else {
//       todo.todo_text = req.body.todo_text;
//     }
//     todo
//       .save()
//       .then((todo) => {
//         res.json("Todo updated!");
//       })
//       .catch((err) => {
//         res.status(400).send("Update not possible");
//       });
//   });
// });

todoRoutes.post("/update/:id", async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    // console.log("this is req.body", req.body);
    //this is req.body { todo_text: 'test 1 nasdfasdfadsfas' }
    todo.todo_text = req.body.todo_text;
    todo.save();
    if (todo) {
      res.status(200).send("Todo updated!");
    }
  } catch {
    res.status(400).send("Update is not possible");
  }
});

//this endpoint allows us to delete an existing todo item
/* handle: DELETE /todos/:id
   DESC: deleete an existing todo item
*/
todoRoutes.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let deleteToDo = await Todo.findByIdAndDelete(id);
    if (deleteToDo) {
      res.status(200).send("Todo was deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Did not delete the todo with that id");
  }
});

app.listen(PORT, function () {
  console.log("Server is running on Port:" + PORT);
});
