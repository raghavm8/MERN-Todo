// creating the refrences for using the express properties
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const todoRoutes = express.Router();

// a refrence is made  for the model(it is the model of the database) created in the todo.model.js file 
let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

// connecting the monogodb to the server
mongoose.connect('mongodb://127.0.0.1:27017/todo',{useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open',function(){
    console.log("mongodb connection established successfully");
});


todoRoutes.route('/').get(function(req , res){
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }
        else{
            res.json(todo);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res){
    let id = req.params.id;
    Todo.findById(id,function(err,todo){
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function(req, res){
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding failed');
        });
});

todoRoutes.route('/update/:id').post(function(req, res){
    let id = req.params.id;
    Todo.findById(id, function(err,todo){
        if(!todo){
            res.status(404).send("data is not found");
        }
        else{
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;    
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('todo updated');
            })
            .catch(err => {
                 res.status(400).send('update not successful');   
            })
        }
    });
});

// to make a connection with the router for the server
// router acts as a middle way for server and database
// it is responsible for sending and recieving the data
app.use('/todo', todoRoutes);

// to start the server
app.listen(PORT, function(){
    console.log("server is running on port: " + PORT);
});

// 'Set-ExecutionPolicy RemoteSigned' = command in case nodemon server running permissions are denied by the system