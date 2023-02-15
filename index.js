const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask"); // (Concept: Working with a MongoDB Database Directly in Node.js)

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));


//Connect to the MongoDB database
mongoose.connect(process.env.DB_CONNECT).then(()=>{ // (Concept: Working with a MongoDB Database Directly in Node.js)
    console.log("Connected to db!");

    app.listen(3000, () => console.log("Server Up and running"));
})

// View Engine configuration (Concept: Templates)
app.set("view engine", "ejs");

// GET METHOD
app.get("/", (req, res) => { // (Concept: HTTP request/response handling)
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks }); // (Concept: Templates)
    });
});

// POST METHOD
app.post('/',async (req, res) => { // (Concept: Asynchronous Programming)
    const todoTask = new TodoTask({
        content: req.body.content // (Concept: Form Handling)
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// Update todo item
app
    .route("/edit/:id")
    .get((req, res) => { // (Concept: HTTP request/response handling)
        const id = req.params.id; // Save the id from the request

        // Find task that is being edited
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id }); // Render the edit template (Concept: Templates)
        });
    })
    .post((req, res) => { // (Concept: HTTP request/response handling)
        const id = req.params.id; // Save the id from the request

        // Call function to update task with the id
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/"); // Return to home
        });
    });

// Delete todo item
app.route("/remove/:id").get((req, res) => { // (Concept: HTTP request/response handling)
    const id = req.params.id; // Save the id from the request

    // Call function to remove task with the id
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/"); // Return to home
    });
});

