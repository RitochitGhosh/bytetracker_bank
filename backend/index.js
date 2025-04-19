const express = require("express");
const connectDB = require("./config/db");
const { requestLogger } = require("./middlewares/requestLogger")
const userRouter = require("./routes/user-route");

const app = express();
const PORT = 8000;

connectDB("mongodb://127.0.0.1:27017/byte-tracker-bank_").then(() => console.log("MongoDB connected...\n")) 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger("./log.txt"));

app.use("/api/", userRouter);


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
