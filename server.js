const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const colors = require("colors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const proofRoutes = require("./routes/proofRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/proofs", proofRoutes);

// test route
app.get("/", (req, res) => {
  res.send("MPFL API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port number : ${PORT}`.bgMagenta.white);
});
