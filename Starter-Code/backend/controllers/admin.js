const { pool } = require("../models/db");

const getAllOrders = (req, res) => {
  const query = `
    SELECT 
        orders.id AS order_id,
        requester.first_name AS requester_first_name,
        requester.last_name AS requester_last_name,
        collector.first_name AS collector_first_name,
        collector.last_name AS collector_last_name,
        collector.id AS collector_id, 
        orders.status,
        orders.last_price,
        orders.order_time,
        orders.location,
        orders.arrive_time,
        orders.predicted_price,

      
        COALESCE(JSON_AGG(
            JSONB_BUILD_OBJECT(
                'request_id', requests.id,
                'category_name', category.category_name,
                'description', requests.description,
                'request_status', requests.status,
                'weight', requests.weight,
                'length', requests.length,
                'width', requests.width,
                'height', requests.height,
                'request_predicted_price', requests.predicted_price
            )
        ) FILTER (WHERE requests.id IS NOT NULL), '[]') AS requests_list

    FROM orders
    INNER JOIN users AS requester ON requester.id = orders.user_id
    LEFT JOIN users AS collector ON collector.id = orders.collector_id
    LEFT JOIN requests ON requests.order_id = orders.id
    LEFT JOIN category ON category.id = requests.category_id

    GROUP BY orders.id, requester.first_name, requester.last_name, 
             collector.first_name, collector.last_name, orders.status, 
             collector.id, collector.first_name, collector.last_name,
             orders.last_price, orders.order_time, orders.location, 
             orders.arrive_time, orders.predicted_price;
  `;
  pool
    .query(query)
    .then((result) => {
      if (!result.rows.length) {
        return res.status(200).json({
          success: true,
          message: "No orders yet!",
        });
      }
      res.status(200).json({
        success: true,
        orders: result.rows,
      });
    })
    .catch((err) => {
      console.error("Database error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    });
};

//Admin Accept/Reject user's order request

const AcceptRequest = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (status !== "accepted" && status !== "rejected") {
    return res.status(400).json({
      message: "Invalid status value. Use 'accepted' or 'rejected'.",
    });
  }

  const query = `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;

  const values = [status, orderId];

  pool
    .query(query, values)
    .then((result) => {
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found." });
      }

      res.status(200).json({
        success: true,
        message: `Order ${orderId} status updated to ${status}.`,
        order: result.rows[0],
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    });
};

//Admin choose which collector will collect from user

const chooseCollector = (req, res) => {
  const orderId = req.params.id;
  const { collector_id } = req.body;

  if (![12, 13, 14,32].includes(collector_id)) {
    return res
      .status(400)
      .json({ message: "Invalid id value. Use '12', '13', or '14' only" });
  }

  const query = `
        UPDATE orders
        SET collector_id = $1
        WHERE id = $2 
        RETURNING *
    `;

  pool
    .query(query, [collector_id, orderId])
    .then((result) => {
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found." });
      }

      const updatedOrder = result.rows[0];

      // collector name from users table
      const collectorQuery = `
                SELECT first_name FROM users WHERE id = $1
            `;

      pool
        .query(collectorQuery, [collector_id])
        .then((collectorResult) => {
          const collectorName = collectorResult.rows[0].first_name;

          res.status(200).json({
            success: true,
            message: `Order ${orderId} updated with collector id ${collector_id}`,
            order: updatedOrder,
            collector_name: collectorName,
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
          });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    });
};

const changeOrderStatusById = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ["pending", "approved", "completed", "cancelled","rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status value. Allowed values: ${validStatuses.join(
        ", "
      )}.`,
    });
  }

  const query = `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;

  const values = [status, orderId];
  pool
    .query(query, values)
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }
      res.status(200).json({
        success: true,
        message: `Order ${orderId} status updated to '${status}'.`,
        order: result.rows[0],
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    });
};

module.exports = { getAllOrders, AcceptRequest, chooseCollector ,changeOrderStatusById};

