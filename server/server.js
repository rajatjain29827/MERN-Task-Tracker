const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

// Diagnostic route to check if public files exist
app.get("/health", (req, res) => {
  const publicDir = path.join(__dirname, "public");
  const indexPath = path.join(publicDir, "index.html");
  res.json({
    status: "OK",
    publicDir,
    indexPath,
    indexExists: fs.existsSync(indexPath),
    __dirname
  });
});

const clientBuild = path.join(__dirname, "public");
app.use(express.static(clientBuild));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
