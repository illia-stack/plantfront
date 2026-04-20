const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Statische Dateien aus dem Build-Ordner bereitstellen
app.use(express.static(path.join(__dirname, "build")));

// Alle Routen auf index.html umleiten (für React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
})