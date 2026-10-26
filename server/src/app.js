const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;   