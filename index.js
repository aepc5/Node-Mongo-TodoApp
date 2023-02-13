const express = require("express");
const app = express();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// View Engine configuration
app.set("view engine", "ejs");

// Get method
app.get('/',(req, res) => {
    res.render('todo.ejs');
});

// Post Method
app.post('/',(req, res) => {
    console.log(req.body);
});

app.listen(3000, () => console.log("Server Up and running"));
