const { pool } = require("../models/db");

const updateOrdersDetailsById = (req, res) => {
  const { id } = req.params;
  const collector_id = req.token.userId;
  let { last_price, status } = req.body;
  const query = `
    WITH updated_order AS (
        UPDATE orders 
        SET 
          last_price = COALESCE($1, last_price),
          status = COALESCE($2, status)
        WHERE id = $3
        RETURNING *
    )
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
    FROM updated_order
    INNER JOIN users AS requester ON requester.id = updated_order.user_id
    LEFT JOIN users AS collector ON collector.id = updated_order.collector_id
    LEFT JOIN requests ON requests.order_id = updated_order.id
    LEFT JOIN category ON category.id = requests.category_id
    GROUP BY updated_order.id, requester.first_name, requester.last_name, 
             collector.first_name, collector.last_name, updated_order.status, 
             collector.id, updated_order.last_price, updated_order.order_time, 
             updated_order.location, updated_order.arrive_time, updated_order.predicted_price;
  `;

  const data = [last_price || null, status || "pending", id];

  console.log("Data:", data);

  pool
    .query(query, data)
    .then((result) => {
      console.log("Updated rows:", result.rows);

      if (result.rows.length > 0) {
        return res.status(200).json({
          success: true,
          message: `Order with ID ${id} updated successfully`,
          result: result.rows[0],
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `No matching order found for ID ${id} or you are not authorized to update this order`,
        });
      }
    })
    .catch((err) => {
      console.error("Error updating order:", err);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    });
};

module.exports = { updateOrdersDetailsById };
