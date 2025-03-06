require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const AdminRouter = require("./routers/admin");
const collectorRouter = require("./routers/collector");
const authRouter = require("./routers/authRoutes");

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/admin", AdminRouter);
app.use("/collector", collectorRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
