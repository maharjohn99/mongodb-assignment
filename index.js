import socketio from "socket.io";
import logger from "morgan";
import http from "http";
import express from "express";


// mongo connection
import "./config/mongo.js";

// socket configuration
import WebSockets from "./utils/WebSockets.js";


// routes
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import commentRouter from "./routes/comment.js";


// middlewares
import { decode } from './middlewares/jwt.js'
const app = express();
const port = process.env.PORT || "3000";
app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/posts", decode, postRouter);
app.use("/comments", decode, commentRouter);

app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API does not exist!'
  })
});

const server = http.createServer(app);
global.io = socketio.listen(server);
global.io.on('connection', WebSockets.connection)
server.listen(port);

server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
