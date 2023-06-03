const express = require('express');
const app = express();
const cors = require("cors");


const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

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
//invoice route
const invoiceRouter = require("./routes/invoice");
app.use("/invoice", invoiceRouter);
//payment route
const paymentRouter = require("./routes/payment");
app.use("/payment", paymentRouter);
//memo route
const memoRouter = require("./routes/memo");
app.use("/memo", memoRouter);
//delivery route
const deliveryRouter = require("./routes/delivery");
app.use("/delivery", deliveryRouter);
//dashboard route
const dashboardRouter = require("./routes/dashboard");
app.use("/", dashboardRouter);

//Port
app.listen(3001, () => {
    console.log("server is running");
});
