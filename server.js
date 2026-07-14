const express = require('express');
const path = require('path');
const compression = require("compression");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIRST: security & performance middleware
app.use(helmet());
app.use(compression());

// ✅ THEN: static files
app.use(express.static(path.join(__dirname, 'build')));

// ✅ THEN: React fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ✅ LAST: start server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});