
const express = require("express");

const {
  login,
  register,
  createRequest,
  getRequestsById,
  updateRequestById,
  cancelOrderById,
  getALLOrdersById,
  getAssignOrderById,
  cancelRequestById,
  createOrder

} = require("../controllers/user");
const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/createRequestByuserId", authentication, createRequest);
userRouter.put("/updateRequestById/:id", authentication, updateRequestById);
userRouter.get("/getRequestByuserId", authentication,getRequestsById);
userRouter.put("/cancelOrderById/:id",cancelOrderById);


/* userRouter.get("/getOrderById",authentication, getALLOrdersById); *///user
userRouter.get("/getAssignOrderById",authentication, getAssignOrderById );//collector
userRouter.delete("/cancelRequestById/:id",cancelRequestById)

userRouter.get("/getOrderById", authentication,getALLOrdersById);//user
userRouter.post("/createOrders", authentication, createOrder);



module.exports = userRouter;