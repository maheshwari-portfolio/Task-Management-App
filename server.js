const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/taskmanager")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// Test route
app.get("/", (req, res) => {
    res.send("Task Management API is running");
});
// REGISTER - Create User
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
// LOGIN - Check User
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// CREATE - Add Task
app.post("/tasks", async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ - Get all Tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - Edit Task
app.put("/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - Complete Task
app.put("/tasks/:id/complete", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { status: "Completed" },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE - Delete Task
app.delete("/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});