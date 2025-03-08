import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import {
  setOrders,
  setCollector,
  setOrderStatus,
} from "../../redux/reducers/adminOrders";
const AdminDash = () => {
  const [message, setMessage] = useState("");
  const [collector_id, setCollector_id] = useState();
  const [status, setStatus] = useState();
  const dispatch = useDispatch();
  // ================================================================
  const authToken = useSelector((reducers) => reducers.authReducer.token);
  const orders = useSelector((reducers) => reducers.adminOrdersReducer.orders);
  const getAllOrders = () => {
    axios
      .get("https://trash2cash-liav.onrender.com/admin/getAllOrders")
      .then((result) => {
        console.log(result);
        dispatch(setOrders(result.data.orders));
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
      });
  };
  const assignOrderToCollector = (id) => {
    axios
      .put(`https://trash2cash-liav.onrender.com/admin/chooseCollector/${id}`, {
        collector_id: Number(collector_id),
      })
      .then((result) => {
        dispatch(setCollector(result.data.order));

        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const changeOrderStatusById = (id) => {
    axios
      .put(`https://trash2cash-liav.onrender.com/admin/changeOrderStatusById/${id}`, {
        status: String(status),
      })
      .then((result) => {
        console.log(result);
        dispatch(setOrderStatus(result.data.order));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllOrders();
  }, []);
  return (
    <div>
      {orders?.map((order, index) => (
        <div>
          {order.user_id}
          <br />
          {order.status}
          <br />
          {order.collector_id}

          <input
            placeholder="collectorId"
            onChange={(e) => {
              setCollector_id(e.target.value);
            }}
          />
          <button
            id={order.order_id}
            onClick={(e) => {
              assignOrderToCollector(e.target.id);
            }}
          >
            assign
          </button>
          <input
            placeholder="status"
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          />
          <button
            id={order.order_id}
            onClick={(e) => {
              changeOrderStatusById(e.target.id);
            }}
          >
            change status
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDash;
