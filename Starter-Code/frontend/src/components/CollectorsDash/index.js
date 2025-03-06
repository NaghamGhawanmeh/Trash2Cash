// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import { useSelector, useDispatch } from "react-redux";

// import {
//   setOrders,
//   setOrderDetails,
// } from "../../redux/reducers/collectorOrders";
// const CollectorsDash = () => {
//   const [last_price, setLast_price] = useState();
//   const [status, setStatus] = useState();
//   const authToken = useSelector((reducers) => reducers.authReducer.token);
//   const orders = useSelector(
//     (reducers) => reducers.collectorOrdersReducer.orders
//   );

//   const dispatch = useDispatch();

//   const getAssignedOrdersById = () => {
//     axios
//       .get(`http://localhost:5000/user/getAssignOrderById`, {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((result) => {
//         console.log(result);
//         dispatch(setOrders(result.data.result));
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const updateOrderDetailsById = (id) => {
//     axios
//       .put(
//         `http://localhost:5000/collector/updateRequestDetailsById/${id}`,
//         { last_price, status },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((result) => {
//         console.log(result);
//         dispatch(setOrderDetails(result.data.result))
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   useEffect(() => {
//     getAssignedOrdersById();
//   }, []);
//   return (
//     <div>
//         hujk        
//       {orders?.map((order, index) => (
//         <div>
//           <p>{order.status}</p>
//           <p>{order.last_price}</p>
//           <p>{order.location}</p>
//           <input
//             placeholder="last price"
//             onChange={(e) => {
//               setLast_price(e.target.value);
//             }}
//           />
//           <input
//             placeholder="status"
//             onChange={(e) => {
//               setStatus(e.target.value);
//             }}
//           />
//           <button
//             id={order.id}
//             onClick={(e) => {
//               updateOrderDetailsById(e.target.id);
//             }}
//           >
//             update order
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CollectorsDash;
