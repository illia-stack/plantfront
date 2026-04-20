const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});