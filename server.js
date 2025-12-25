const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

dotenv.config();

const app = express();

connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);

// test route
app.get("/", (req, res) => {
  res.send("MPFL API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port number : ${PORT}`.bgMagenta.white);
});
