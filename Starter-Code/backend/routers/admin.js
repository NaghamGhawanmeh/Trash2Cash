const {getAllOrders, AcceptRequest, chooseCollector,changeOrderStatusById}=require("../controllers/admin")
const authorization=require("../middleware/authorization")
const express = require("express");
const AdminRouter=express.Router()


AdminRouter.get("/getAllOrders", getAllOrders)
AdminRouter.put("/AcceptRequest/:id",  AcceptRequest)
AdminRouter.put("/chooseCollector/:id",  chooseCollector)
AdminRouter.put("/changeOrderStatusById/:id",  changeOrderStatusById)

module.exports=AdminRouter