const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));


//Connect to the MongoDB database
mongoose.connect(process.env.DB_CONNECT).then(()=>{
    console.log("Connected to db!");

    app.listen(3000, () => console.log("Server Up and running"));
})

// View Engine configuration
app.set("view engine", "ejs");

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
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
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id }); // Render the edit template
        });
    })
    .post((req, res) => {
        const id = req.params.id; // Save the id from the request

        // Call function to update task with the id
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/"); // Return to home
        });
    });

// Delete todo item
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id; // Save the id from the request

    // Call function to remove task with the id
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/"); // Return to home
    });
});

