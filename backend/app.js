require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const connectToDB = require("./config/db.js");
const errorHandler = require("./middlewares/errorHandler.js");

// Import Routes
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const carPoolRoutes = require("./routes/carpool.route.js");
const projectRoutes = require("./routes/project.route.js");
const carRentalRoutes = require("./routes/carrental.route.js");
const lostnFoundRoutes = require("./routes/lostnfound.route.js");
const messageRoutes = require("./routes/message.route.js");

const app = express();
connectToDB();

// Middleware 

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/carpool', carPoolRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/carrental', carRentalRoutes);
app.use('/api/lostnfound', lostnFoundRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send("API Working");
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
