const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const { initSocket } = require("./socket/socket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

initSocket(server);




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
