import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrder, deleteOrder } from "../../redux/reducers/request";

const COLORS = {
  primary: "#0E1D40",
  secondary: "#3A9E1E",
  accent: "#F3B811",
  background: "#F9F9F9",
  textPrimary: "#333333",
  textSecondary: "#666666",
  danger: "#E53935",
  success: "#43A047",
  warning: "#FB8C00",
  info: "#039BE5",
  gray: "#757575",
};

const STATUS_COLORS = {
  pending: { bg: COLORS.accent, color: COLORS.primary },
  approved: { bg: COLORS.info, color: "white" },
  completed: { bg: COLORS.success, color: "white" },
  cancelled: { bg: COLORS.danger, color: "white" },
  rejected: { bg: COLORS.gray, color: "white" },
};

const OrderManagementPage = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const orders = state.userRequest.orders || [];
  const token = state.authReducer.token;

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const cancelOrder = (id, index) => {
    setIsModalOpen(false);
    setShowConfirmation(false);
    axios
      .put(`https://trash2cash-liav.onrender.com/user/cancelOrderById/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        if (result.status === 200) {
          dispatch(deleteOrder(index));
          showMessage("Order cancelled successfully", "success");
        }
      })
      .catch((error) => {
        console.error(error);
        showMessage("Failed to cancel order", "error");
      });
  };

  useEffect(() => {
    axios
      .get("https://trash2cash-liav.onrender.com/user/getOrderById", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        console.log(result.data.result);

        dispatch(setOrder(result.data.result));
      })
      .catch((error) => {
        console.error(error);
        showMessage("Failed to load orders", "error");
      });
  }, [token, dispatch]);

  const filteredOrders = orders
    .filter((order) => {
      if (activeTab !== "all" && order.status !== activeTab) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.id.toString().includes(searchLower) ||
          order.location.toLowerCase().includes(searchLower) ||
          (order.collecter_id &&
            order.collecter_id.toString().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.order_time) - new Date(a.order_time);
      } else if (sortOrder === "oldest") {
        return new Date(a.order_time) - new Date(b.order_time);
      } else if (sortOrder === "priceHigh") {
        return (
          (b.last_price || b.predicted_price) -
          (a.last_price || a.predicted_price)
        );
      } else if (sortOrder === "priceLow") {
        return (
          (a.last_price || a.predicted_price) -
          (b.last_price || b.predicted_price)
        );
      }
      return 0;
    });

  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const renderOrderDetails = (order) => {
    if (!order) return null;

    const statusInfo = {
      pending: { icon: "⏳", text: "Your order is waiting to be accepted." },
      approved: {
        icon: "✅",
        text: "Your order has been accepted and is being processed.",
      },
      completed: {
        icon: "🎉",
        text: "Your order has been successfully completed.",
      },
      cancelled: { icon: "❌", text: "This order has been cancelled." },
      rejected: { icon: "⛔", text: "Sorry, This order was rejected" },
    };

    const info = statusInfo[order.status] || {
      icon: "ℹ️",
      text: "Status information unavailable.",
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "700px",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          }}
        >
          <button
            onClick={() => {
              setIsModalOpen(false);
              setShowConfirmation(false);
            }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: COLORS.textSecondary,
            }}
          >
            ×
          </button>

          <div
            style={{
              padding: "2rem",
              borderBottom: `5px solid ${STATUS_COLORS[order.status].bg}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ color: COLORS.primary, margin: 0 }}>
                Order Details
              </h2>
              <span
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  backgroundColor: STATUS_COLORS[order.status].bg,
                  color: STATUS_COLORS[order.status].color,
                  fontWeight: 600,
                }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: "8px",
                marginBottom: "2rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginRight: "1rem" }}>
                {info.icon}
              </div>
              <p style={{ margin: 0, color: COLORS.textPrimary }}>
                {info.text}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}
                >
                  Order ID
                </label>
                <p
                  style={{
                    margin: "0.2rem 0 1rem 0",
                    fontWeight: "600",
                    color: COLORS.primary,
                  }}
                >
                  {order.id}
                </p>
              </div>

              <div>
                <label
                  style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}
                >
                  Order Date & Time
                </label>
                <p style={{ margin: "0.2rem 0 1rem 0", fontWeight: "500" }}>
                  {new Date(order.order_time).toLocaleDateString()} at{" "}
                  {new Date(order.order_time).toLocaleTimeString()}
                </p>
              </div>

              <div>
                <label
                  style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}
                >
                  Location
                </label>
                <p style={{ margin: "0.2rem 0 1rem 0", fontWeight: "500" }}>
                  {order.location}
                </p>
              </div>

              <div>
                <label
                  style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}
                >
                  Predicted Price
                </label>
                <p
                  style={{
                    margin: "0.2rem 0 1rem 0",
                    fontWeight: "600",
                    color: COLORS.secondary,
                  }}
                >
                  ${order.predicted_price}
                </p>
              </div>

              {order.last_price && (
                <div>
                  <label
                    style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}
                  >
                    Final Price
                  </label>
                  <p
                    style={{
                      margin: "0.2rem 0 1rem 0",
                      fontWeight: "600",
                      color: COLORS.secondary,
                    }}
                  >
                    ${order.last_price}
                  </p>
                </div>
              )}

              {order.collecter_id && (
                <div>
                  <label
                    style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}
                  >
                    Collector ID
                  </label>
                  <p style={{ margin: "0.2rem 0 1rem 0", fontWeight: "500" }}>
                    {order.collecter_id}
                  </p>
                </div>
              )}

              {order.arrive_time && (
                <div>
                  <label
                    style={{ color: COLORS.textSecondary, fontSize: "0.9rem" }}
                  >
                    Estimated Arrival
                  </label>
                  <p style={{ margin: "0.2rem 0 1rem 0", fontWeight: "500" }}>
                    {new Date(order.arrive_time).toLocaleDateString()} at{" "}
                    {new Date(order.arrive_time).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {order.status === "pending" && !showConfirmation && (
            <div
              style={{
                padding: "1.5rem",
                borderTop: "1px solid #eee",
                textAlign: "right",
              }}
            >
              <button
                style={{
                  backgroundColor: COLORS.danger,
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => setShowConfirmation(true)}
              >
                Cancel Order
              </button>
            </div>
          )}

          {showConfirmation && (
            <div
              style={{
                padding: "1.5rem",
                borderTop: "1px solid #eee",
                backgroundColor: "rgba(229, 57, 53, 0.05)",
              }}
            >
              <h3
                style={{
                  color: COLORS.danger,
                  margin: "0 0 1rem 0",
                }}
              >
                Confirm Cancellation
              </h3>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  color: COLORS.textPrimary,
                }}
              >
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                }}
              >
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: COLORS.textSecondary,
                    border: "1px solid #ddd",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowConfirmation(false)}
                >
                  No, Keep Order
                </button>
                <button
                  style={{
                    backgroundColor: COLORS.danger,
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const index = orders.findIndex((o) => o.id === order.id);
                    cancelOrder(order.id, index);
                  }}
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: COLORS.background, minHeight: "100vh" }}>
      <div
        style={{
          backgroundColor: COLORS.primary,
          padding: "2rem",
          color: "white",
          borderBottom: `5px solid ${COLORS.accent}`,
        }}
      >
        <h1 style={{ margin: 0, marginBottom: "1rem" }}>My Orders</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Track and manage all your orders from one place
        </p>
      </div>

      {message && (
        <div
          style={{
            backgroundColor:
              messageType === "error"
                ? COLORS.danger
                : messageType === "success"
                  ? COLORS.success
                  : COLORS.accent,
            color:
              messageType === "error" || messageType === "success"
                ? "white"
                : COLORS.primary,
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage("")}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            ×
          </button>
        </div>
      )}

      <div
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", overflowX: "auto", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("all")}
            style={{
              backgroundColor: activeTab === "all" ? COLORS.primary : "white",
              color: activeTab === "all" ? "white" : COLORS.textPrimary,
              border: `1px solid ${activeTab === "all" ? COLORS.primary : "#ddd"}`,
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            All Orders ({orders.length})
          </button>
          {["pending", "approved", "completed", "cancelled", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                style={{
                  backgroundColor:
                    activeTab === status ? STATUS_COLORS[status].bg : "white",
                  color:
                    activeTab === status
                      ? STATUS_COLORS[status].color
                      : COLORS.textPrimary,
                  border: `1px solid ${activeTab === status ? STATUS_COLORS[status].bg : "#ddd"}`,
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {getStatusCount(status)})
              </button>
            )
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search by ID or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "0.5rem 1rem 0.5rem 2.5rem",
                borderRadius: "20px",
                border: "1px solid #ddd",
                width: "220px",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.textSecondary,
              }}
            >
              🔍
            </span>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #ddd",
              backgroundColor: "white",
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="priceLow">Price: Low to High</option>
          </select>
        </div>
      </div>

      <div style={{ padding: "2rem" }}>
        {filteredOrders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              background: "white",
              borderRadius: "12px",
              border: `2px dashed ${COLORS.textSecondary}`,
              margin: "2rem auto",
              maxWidth: "800px",
            }}
          >
            {orders.length === 0 ? (
              <>
                <h2 style={{ color: COLORS.primary, marginBottom: "1rem" }}>
                  No Orders Found
                </h2>
                <p
                  style={{ color: COLORS.textSecondary, marginBottom: "2rem" }}
                >
                  You haven't placed any orders yet.
                </p>
                <button
                  style={{
                    backgroundColor: COLORS.primary,
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Place Your First Order
                </button>
              </>
            ) : (
              <>
                <h2 style={{ color: COLORS.primary, marginBottom: "1rem" }}>
                  No Matching Orders
                </h2>
                <p style={{ color: COLORS.textSecondary }}>
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "2rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            }}
          >
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  border: `1px solid #eee`,
                  borderTop: `5px solid ${STATUS_COLORS[order.status].bg}`,
                }}
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                  setShowConfirmation(false);
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0, 0, 0, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px rgba(0, 0, 0, 0.05)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.5rem",
                    borderBottom: "1px solid #eee",
                    backgroundColor: "white",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: COLORS.primary }}>
                      Order #{index + 1}
                    </h3>
                    <small style={{ color: COLORS.textSecondary }}>
                      ID: {order.id}
                    </small>
                  </div>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      backgroundColor: STATUS_COLORS[order.status].bg,
                      color: STATUS_COLORS[order.status].color,
                    }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* Order Body */}
                <div style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: "0.9rem",
                          color: COLORS.textSecondary,
                          display: "block",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Date
                      </label>
                      <span
                        style={{
                          fontWeight: 500,
                          color: COLORS.textPrimary,
                          display: "block",
                        }}
                      >
                        {new Date(order.order_time).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.9rem",
                          color: COLORS.textSecondary,
                          display: "block",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Time
                      </label>
                      <span
                        style={{
                          fontWeight: 500,
                          color: COLORS.textPrimary,
                          display: "block",
                        }}
                      >
                        {new Date(order.order_time).toLocaleTimeString()}
                      </span>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.9rem",
                          color: COLORS.textSecondary,
                          display: "block",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Price
                      </label>
                      <span
                        style={{
                          fontWeight: 600,
                          color: COLORS.secondary,
                          display: "block",
                        }}
                      >
                        ${order.last_price || order.predicted_price}
                        {!order.last_price && (
                          <small
                            style={{
                              color: COLORS.textSecondary,
                              marginLeft: "0.3rem",
                            }}
                          >
                            (est.)
                          </small>
                        )}
                      </span>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "0.9rem",
                          color: COLORS.textSecondary,
                          display: "block",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Location
                      </label>
                      <span
                        style={{
                          fontWeight: 500,
                          color: COLORS.textPrimary,
                          display: "block",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.location}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1rem",
                      padding: "1rem 0 0 0",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.9rem",
                        color: COLORS.textSecondary,
                      }}
                    >
                      {order.status === "completed"
                        ? "Completed"
                        : order.status === "cancelled"
                          ? "Cancelled"
                          : order.status === "rejected"
                            ? "Rejected"
                            : order.status === "approved"
                              ? "In Progress"
                              : "Awaiting Approval"}
                    </span>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: COLORS.primary,
                        border: `1px solid ${COLORS.primary}`,
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                        setShowConfirmation(false);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          margin: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h2 style={{ color: COLORS.primary, marginBottom: "1.5rem" }}>
          Order Summary
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "2rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: COLORS.primary,
                marginBottom: "0.5rem",
              }}
            >
              {orders.length}
            </div>
            <div style={{ color: COLORS.textSecondary }}>Total Orders</div>
          </div>

          {["pending", "approved", "completed", "cancelled", "rejected"].map(
            (status) => (
              <div key={status} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: STATUS_COLORS[status].bg,
                    marginBottom: "0.5rem",
                  }}
                >
                  {getStatusCount(status)}
                </div>
                <div style={{ color: COLORS.textSecondary }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {isModalOpen && renderOrderDetails(selectedOrder)}
    </div>
  );
};

export default OrderManagementPage;
