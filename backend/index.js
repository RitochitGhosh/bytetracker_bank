const express = require("express");
const connectDB = require("./config/db");
const { requestLogger } = require("./middlewares/requestLogger")
const userRouter = require("./routes/user-route");
require("dotenv").config();

const app = express();

connectDB().then(() => console.log("MongoDB connected...\n")) 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger("./log.txt"));

app.use("/api/", userRouter);


app.listen(process.env.PORT || 8000, () => console.log(`Server listening on ${process.env.PORT}`));
