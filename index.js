const express = require('express');
const app = express();
const cors = require("cors");


const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

app.use(cookieParser());

//Routes
//login route
const loginRouter = require("./routes/login");
app.use("/login", loginRouter)
//stock route
const inventoryRouter = require("./routes/inventory");
app.use("/stocks", inventoryRouter);
//client route
const clientRouter = require("./routes/clients");
app.use("/clients", clientRouter);
//agent route
const agentRouter = require("./routes/agents");
app.use("/agents", agentRouter);
//user route
const userRouter = require("./routes/users");
app.use("/manageuser", userRouter);

//Port
app.listen(3001, () => {
    console.log("server is running");
});
