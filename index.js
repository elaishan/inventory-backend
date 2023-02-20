const express = require('express');
const app = express();

const cors = require("cors");

app.use(express.json());
app.use(cors());

const loginRouter = require("./routes/login");

app.use("/login", loginRouter)

app.listen(3001, () => {
    console.log("running server");
});

