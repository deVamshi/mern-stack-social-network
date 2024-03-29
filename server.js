const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

//Middle Ware
app.use(express.json());

app.get("/", (req, res) => res.send("API RUNNING"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
