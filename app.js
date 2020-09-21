const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
let Todo = require("./models/todo.model");
let User = require("./models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

//create another instance of express router
const authRoutes = express.Router();
//---> to handle all the authentication routes
//adds /auth as a prefix
app.use("/auth", authRoutes);
/*this endpoint allow a new user to register himself
@route POST /auth/register
@acess public
*/
authRoutes.post("/register", async (req, res) => {
  //so that we do not need to use req.body.phone / req.body.password
  let { phone, password } = req.body;
  try {
    console.log("this is in req.body", req.body);
    let user = new User({ phone, password });
    //hash the password with 10 salt rounds before saving
    let hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    //save user
    await user.save();
    //we then create a token to use for jwt
    const payload = {
      //createa a token
      user: {
        id: user._id,
      },
    };
    console.log("This is in the payload", payload);
    //give a token to login after registering
    //https://github.com/auth0/node-jsonwebtoken
    //token is allowed to exist for 1 hour -> key in sign needs to match verified
    jwt.sign(payload, "tokenisverified", { expiresIn: 3600 }, (err, token) => {
      //throw the error if any
      if (err) throw err;
      //else we send the token(containing the user._id back)
      res.status(200).json({ token });
      console.log("Registered,the token was sent successfully");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "user was not registered" });
  }
});
/*this endpoint the user to login (provided that he already registered)
@route POST /auth/login
@acess public
*/
authRoutes.post("/login", async (req, res) => {
  let { phone, password } = req.body;
  try {
    //find the user based on phone
    let user = await User.findOne({ phone });
    //check that the user exists
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    //compared keyed password with password in db
    //refere to bcrypt.compare docs https://www.npmjs.com/package/bcrypt-> 1st params is password in plaintext, 2nd params is hash from db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Help! someone wants to hack us" });
    }
    //if hashed plaintext matches the hash in db, we return back a token
    const payload = {
      user: {
        id: user._id,
      },
    };
    //now we can use the token for jwt
    jwt.sign(payload, "tokenisverified", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
      console.log("Logged in,the token was sent successfully");
    });
  } catch (error) {
    res.status(500).json({ message: "The login did not work" });
  }
});

//this section does the checktoken --> needs to be above the routes that use checkToken
//in protected routes we need to include in header: x-auth-token : full token
const checkToken = (req, res, next) => {
  //we want to hide the token under the header
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({
      message: "There is no token",
    });
  }
  try {
    // jwt.verify takes the token and a secretOrPublicKey
    const decoded = jwt.verify(token, "tokenisverified");
    // to see what is in decoded
    console.log("This is decoded", decoded);
    //assign the decoded token to the req.user
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "The token was not valid",
    });
  }
};

//---> to handle all the todo routes
app.use("/todos", todoRoutes);

//this endpoint delivers all available todos items
/* handle: GET /todos/
   DESC: retrieves all todo items
   @access private
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
todoRoutes.get("/", checkToken, async (req, res) => {
  try {
    //we want to find the todos that is created by this user -> search using the created by field
    let todos = await Todo.find({ createdBy: req.user._id });
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
   @access private
*/
// todoRoutes.route("/:id").get(function (req, res) {
//   let id = req.params.id;
//   Todo.findById(id, function (err, todo) {
//     res.json(todo);
//   });
// });
todoRoutes.get("/:id", checkToken, async (req, res) => {
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
   @access private
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
todoRoutes.post("/add", checkToken, async (req, res) => {
  try {
    let todo = new Todo(req.body);
    //add the created by field into the todo
    todo.createdBy = req.user._id;
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
   @access private
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

todoRoutes.post("/update/:id", checkToken, async (req, res) => {
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
   @access private
*/
todoRoutes.delete("/:id", checkToken, async (req, res) => {
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
