// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { 
//   createOrderStart, 
//   createOrderSuccess, 
//   createOrderFailure 
// } from '../../redux/reducers/createOrder';

// const OrderCreate = () => {
//   const [location, setLocation] = useState('');
//   const dispatch = useDispatch();

//   const order = useSelector((state) => state.order.order);
//   const loading = useSelector((state) => state.order.loading);
//   const error = useSelector((state) => state.order.error);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (location) {
//       dispatch(createOrderStart()); 
//       axios
//         .post('https://trash2cash-liav.onrender.com/user/createOrders', { location }) 
//         .then((response) => {
//           dispatch(createOrderSuccess(response.data.order));
//         })
//         .catch((err) => {
//           const errorMessage = err.response ? err.response.data.message : err.message;
//           dispatch(createOrderFailure(errorMessage));
//         });
//     }
//   };

//   return (
//     <div className="order-create-container">
//       <h2>Create Order</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter Location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Creating Order...' : 'Create Order'}
//         </button>
//       </form>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {order && (
//         <div className="order-details">
//           <h3>Order Created Successfully</h3>
//           <p>Order ID: {order.id}</p>
//           <p>Location: {order.location}</p>
//           <p>Predicted Price: ${order.predicted_price}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderCreate;
