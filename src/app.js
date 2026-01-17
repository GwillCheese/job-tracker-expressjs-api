require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

