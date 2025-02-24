const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./routes/userRoutes.js");

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/BlogVerse')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB Connection Failed", err);
        process.exit(1);
});

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"));

// Routes
app.use("/user", userRoute);

app.get("/", (req, res) => {
    res.render("Home");
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));