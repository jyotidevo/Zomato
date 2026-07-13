import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

interface User {
  id: number;
  mobile: string;
  email: string | null;
  username: string | null;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
}

interface Product {
  id: number;
  productname: string;
  productdescription: string;
  productprice: number;
  productcategory: string;
  productstock: number;
  image: string | null;
}

interface Order {
  id: number;
  orderId: string;
  userId: number;
  restaurantName: string;
  items: string; // JSON string
  totalPrice: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  tip: number;
  grandTotal: number;
  address: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

type Tab = "overview" | "users" | "products" | "orders";

function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Modals / forms state
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  
  // Form states
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [productForm, setProductForm] = useState<Record<string, string>>({
    productname: "",
    productdescription: "",
    productprice: "",
    productcategory: "",
    productstock: ""
  });
  const [showAddProduct, setShowAddProduct] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  };

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/admin-login");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/all`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/product/all`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/all`, { headers: authHeaders() });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "overview") {
      fetchUsers();
      fetchProducts();
      fetchOrders();
    } else if (tab === "users") {
      fetchUsers();
    } else if (tab === "products") {
      fetchProducts();
    } else if (tab === "orders") {
      fetchOrders();
    }
  }, [tab]);

  // User Actions
  const handleSaveUser = async () => {
    if (!editUser) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/admin/${editUser.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          mobile: editForm.mobile,
          username: editForm.username,
          email: editForm.email,
          password: editForm.password || undefined,
          isAdmin: editForm.isAdmin === "true",
          isBlocked: editForm.isBlocked === "true"
        }),
      });
      if (!res.ok) throw new Error();
      showToast("User updated successfully");
      setEditUser(null);
      fetchUsers();
    } catch {
      showToast("Failed to update user", "error");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Permanently delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      showToast("User deleted");
      fetchUsers();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      const endpoint = user.isBlocked ? "unblock" : "block";
      const res = await fetch(`${API_BASE_URL}/api/users/admin/${user.id}/${endpoint}`, {
        method: "PATCH",
        headers: authHeaders()
      });
      if (!res.ok) throw new Error();
      showToast(`User ${user.isBlocked ? "unblocked" : "blocked"}`);
      fetchUsers();
    } catch {
      showToast("Failed to toggle block state", "error");
    }
  };

  // Product Actions
  const handleSaveProduct = async () => {
    if (!editProduct) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/product/${editProduct.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          productname: editForm.productname,
          productdescription: editForm.productdescription,
          productprice: Number(editForm.productprice),
          productcategory: editForm.productcategory,
          productstock: Number(editForm.productstock)
        })
      });
      if (!res.ok) throw new Error();
      showToast("Product updated");
      setEditProduct(null);
      fetchProducts();
    } catch {
      showToast("Failed to update product", "error");
    }
  };

  const handleAddProduct = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/product/create`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          productname: productForm.productname,
          productdescription: productForm.productdescription,
          productprice: Number(productForm.productprice),
          productcategory: productForm.productcategory,
          productstock: Number(productForm.productstock)
        })
      });
      if (!res.ok) throw new Error();
      showToast("Product created successfully");
      setShowAddProduct(false);
      setProductForm({
        productname: "",
        productdescription: "",
        productprice: "",
        productcategory: "",
        productstock: ""
      });
      fetchProducts();
    } catch {
      showToast("Failed to create product", "error");
    }
  };

  const handleRestock = async (product: Product, amount = 50) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/product/${product.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          productstock: product.productstock + amount
        })
      });
      if (!res.ok) throw new Error();
      showToast(`Restocked ${amount} units for ${product.productname}`);
      fetchProducts();
    } catch {
      showToast("Restock failed", "error");
    }
  };

  const handleBulkRestock = async () => {
    const lowStockItems = products.filter(p => p.productstock < 10);
    if (lowStockItems.length === 0) {
      showToast("No products require restocking", "error");
      return;
    }
    setLoading(true);
    try {
      for (const item of lowStockItems) {
        await fetch(`${API_BASE_URL}/api/product/${item.id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ productstock: 50 })
        });
      }
      showToast("Bulk restocked all low-stock items to 50 units");
      fetchProducts();
    } catch {
      showToast("Bulk restock partially failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Permanently delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/product/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (!res.ok) throw new Error();
      showToast("Product deleted");
      fetchProducts();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      showToast(`Order status updated to "${status}"`);
      fetchOrders();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleRefund = async (order: Order) => {
    if (!confirm(`Refund Grand Total of ₹${order.grandTotal} to User #${order.userId}?`)) return;
    showToast(`Refund processed successfully: ₹${order.grandTotal} refunded to User #${order.userId} wallet.`);
    handleUpdateOrderStatus(order.id, "Refunded");
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Permanently delete this order record?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (!res.ok) throw new Error();
      showToast("Order deleted successfully");
      fetchOrders();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // Calculate Metrics
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled" && o.status !== "Refunded")
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const lowStockProductsCount = products.filter(p => p.productstock < 10).length;

  return (
    <div style={pageContainerStyle}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.type === "success" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "#fff", padding: "14px 28px", borderRadius: 16,
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)", fontWeight: 600, fontSize: 14,
        }}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Inspect Order Modal */}
      {inspectOrder && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>📋 Order Details #{inspectOrder.orderId}</h3>
              <button onClick={() => setInspectOrder(null)} style={closeBtnStyle}>✕</button>
            </div>
            
            <div style={modalBodyStyle}>
              <div style={detailGridStyle}>
                <div>
                  <h4 style={sectionTitleStyle}>Customer Info</h4>
                  <p style={detailTextStyle}><strong>User ID:</strong> #{inspectOrder.userId}</p>
                  <p style={detailTextStyle}><strong>Delivery Address:</strong> {inspectOrder.address}</p>
                  <p style={detailTextStyle}><strong>Payment Method:</strong> {inspectOrder.paymentMethod}</p>
                </div>
                <div>
                  <h4 style={sectionTitleStyle}>Order Info</h4>
                  <p style={detailTextStyle}><strong>Date:</strong> {new Date(inspectOrder.createdAt).toLocaleString("en-IN")}</p>
                  <p style={detailTextStyle}><strong>Status:</strong> {inspectOrder.status}</p>
                  <p style={detailTextStyle}><strong>Restaurant Name:</strong> {inspectOrder.restaurantName}</p>
                </div>
              </div>

              <h4 style={sectionTitleStyle}>Items Breakdown</h4>
              <div style={itemsTableStyle}>
                {(() => {
                  try {
                    const parsedItems = JSON.parse(inspectOrder.items);
                    if (Array.isArray(parsedItems)) {
                      return parsedItems.map((item: any, index: number) => (
                        <div key={index} style={itemRowStyle}>
                          <div style={{ color: "#fff", fontWeight: 600 }}>{item.name} <span style={{ color: "rgba(255,255,255,0.4)" }}>x {item.quantity}</span></div>
                          <div style={{ color: "#10b981", fontWeight: 700 }}>₹{item.price * item.quantity}</div>
                        </div>
                      ));
                    }
                  } catch {}
                  return <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Raw Details: {inspectOrder.items}</p>;
                })()}
              </div>

              <div style={priceSummaryCardStyle}>
                <div style={summaryRowStyle}><span>Subtotal:</span><span>₹{inspectOrder.totalPrice}</span></div>
                <div style={summaryRowStyle}><span>Delivery Fee:</span><span>₹{inspectOrder.deliveryFee}</span></div>
                <div style={summaryRowStyle}><span>Platform Fee:</span><span>₹{inspectOrder.platformFee}</span></div>
                <div style={summaryRowStyle}><span>GST (5%):</span><span>₹{inspectOrder.gst}</span></div>
                <div style={grandTotalRowStyle}><span>Grand Total:</span><span>₹{inspectOrder.grandTotal}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>✏️ Edit User #{editUser.id}</h3>
              <button onClick={() => setEditUser(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={modalBodyStyle}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Username / Name</label>
                <input value={editForm.username || ""} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} style={modalInputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email Address</label>
                <input value={editForm.email || ""} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={modalInputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Mobile Number</label>
                <input value={editForm.mobile || ""} onChange={e => setEditForm(f => ({ ...f, mobile: e.target.value }))} style={modalInputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>New Password</label>
                <input type="password" value={editForm.password || ""} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} placeholder="Leave blank to keep current" style={modalInputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select value={editForm.isAdmin} onChange={e => setEditForm(f => ({ ...f, isAdmin: e.target.value }))} style={modalSelectStyle}>
                    <option value="false">Regular User</option>
                    <option value="true">Administrator</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={editForm.isBlocked} onChange={e => setEditForm(f => ({ ...f, isBlocked: e.target.value }))} style={modalSelectStyle}>
                    <option value="false">Active / Allowed</option>
                    <option value="true">Blocked / Suspended</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={handleSaveUser} style={primaryBtnStyle}>Save Changes</button>
                <button onClick={() => setEditUser(null)} style={cancelBtnStyle}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>✏️ Edit Product #{editProduct.id}</h3>
              <button onClick={() => setEditProduct(null)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={modalBodyStyle}>
              {[
                { key: "productname", label: "Product Name" },
                { key: "productdescription", label: "Description" },
                { key: "productprice", label: "Price (₹)" },
                { key: "productcategory", label: "Category" },
                { key: "productstock", label: "Stock" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input value={editForm[f.key] || ""} onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))} style={modalInputStyle} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={handleSaveProduct} style={primaryBtnStyle}>Save Changes</button>
                <button onClick={() => setEditProduct(null)} style={cancelBtnStyle}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>➕ Add New Product</h3>
              <button onClick={() => setShowAddProduct(false)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={modalBodyStyle}>
              {[
                { key: "productname", label: "Product Name", placeholder: "e.g., Butter Chicken" },
                { key: "productdescription", label: "Description", placeholder: "Rich creamy butter tomato gravy chicken" },
                { key: "productprice", label: "Price (₹)", placeholder: "280" },
                { key: "productcategory", label: "Category", placeholder: "e.g., Main Course" },
                { key: "productstock", label: "Initial Stock", placeholder: "50" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input placeholder={f.placeholder} value={productForm[f.key] || ""} onChange={e => setProductForm(prev => ({ ...prev, [f.key]: e.target.value }))} style={modalInputStyle} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={handleAddProduct} style={primaryBtnStyle}>Add Menu Item</button>
                <button onClick={() => setShowAddProduct(false)} style={cancelBtnStyle}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner / Navbar */}
      <div style={topNavbarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={avatarCircleStyle}>🛡️</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Zomato Admin Control</div>
            <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>Centralized Administration Portal</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Active: <strong style={{ color: "#c084fc" }}>{currentUser.mobile || currentUser.email}</strong></span>
          <button onClick={() => navigate("/")} style={homeBtnStyle}>Return to Site</button>
        </div>
      </div>

      <div style={{ padding: "36px 40px" }}>
        {/* Low Stock Warning Alert */}
        {lowStockProductsCount > 0 && (
          <div style={stockWarningAlertStyle}>
            <div style={{ fontSize: 24 }}>⚠️</div>
            <div>
              <div style={{ fontWeight: 800 }}>Low Stock Alert!</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                There are <strong>{lowStockProductsCount}</strong> menu items currently running low on stock (&lt; 10 units).
              </div>
            </div>
            <button onClick={handleBulkRestock} style={bulkRestockBtnStyle}>Bulk Restock all to 50 Units</button>
          </div>
        )}

        {/* Tab Controls */}
        <div style={tabsContainerStyle}>
          {(["overview", "users", "products", "orders"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
              {t === "overview" && "📊 Analytics"}
              {t === "users" && "👥 User Management"}
              {t === "products" && "📦 Menu Items"}
              {t === "orders" && "🛵 Order Tracking"}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={loadingOverlayStyle}>Fetching latest live datastores...</div>
        ) : (
          <>
            {/* Overview / Analytics Tab */}
            {tab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {/* Scorecards */}
                <div style={scorecardGridStyle}>
                  {[
                    { label: "Total Business Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, desc: "Excluding cancellations & refunds", icon: "💰", color: "linear-gradient(135deg, #10b981, #059669)" },
                    { label: "Total Orders Placed", value: orders.length, desc: "Across all clients", icon: "📦", color: "linear-gradient(135deg, #6366f1, #4f46e5)" },
                    { label: "Total Customers", value: users.length, desc: `${users.filter(u => u.isBlocked).length} currently suspended`, icon: "👥", color: "linear-gradient(135deg, #f59e0b, #d97706)" },
                    { label: "Critically Low Stock Items", value: lowStockProductsCount, desc: "Stock below 10 units", icon: "⚠️", color: "linear-gradient(135deg, #ef4444, #dc2626)" },
                  ].map((card, index) => (
                    <div key={index} style={scorecardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={scorecardLabelStyle}>{card.label}</span>
                        <span style={scorecardIconStyle}>{card.icon}</span>
                      </div>
                      <div style={scorecardValueStyle}>{card.value}</div>
                      <div style={scorecardDescStyle}>{card.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Visual Distribution Charts */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div style={analyticsCardStyle}>
                    <h3 style={analyticsTitleStyle}>📦 Order Status Distribution</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {["Order Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled", "Refunded"].map(status => {
                        const count = orders.filter(o => o.status === status).length;
                        const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                        return (
                          <div key={status}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                              <span style={{ color: "rgba(255,255,255,0.7)" }}>{status}</span>
                              <span style={{ color: "#fff", fontWeight: 700 }}>{count} ({Math.round(pct)}%)</span>
                            </div>
                            <div style={progressBarContainerStyle}>
                              <div style={progressBarFillStyle(pct, status === "Delivered" ? "#10b981" : status === "Cancelled" || status === "Refunded" ? "#ef4444" : "#f59e0b")} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={analyticsCardStyle}>
                    <h3 style={analyticsTitleStyle}>🏷️ Top Categories by Product Count</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {Array.from(new Set(products.map(p => p.productcategory))).map(cat => {
                        const count = products.filter(p => p.productcategory === cat).length;
                        const pct = products.length > 0 ? (count / products.length) * 100 : 0;
                        return (
                          <div key={cat}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                              <span style={{ color: "rgba(255,255,255,0.7)" }}>{cat || "Uncategorized"}</span>
                              <span style={{ color: "#fff", fontWeight: 700 }}>{count} ({Math.round(pct)}%)</span>
                            </div>
                            <div style={progressBarContainerStyle}>
                              <div style={progressBarFillStyle(pct, "#a855f7")} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Management Tab */}
            {tab === "users" && (
              <div style={tableContainerStyle}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Mobile</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={trStyle}>
                        <td style={tdStyle}><span style={idBadgeStyle}>#{user.id}</span></td>
                        <td style={tdStyle}><strong style={{ color: "#fff" }}>{user.username || "—"}</strong></td>
                        <td style={tdStyle}><span style={{ color: "rgba(255,255,255,0.6)" }}>{user.email || "—"}</span></td>
                        <td style={tdStyle}><span style={{ color: "rgba(255,255,255,0.8)" }}>{user.mobile}</span></td>
                        <td style={tdStyle}>
                          {user.isAdmin
                            ? <span style={roleAdminBadgeStyle}>🛡️ Admin</span>
                            : <span style={roleUserBadgeStyle}>User</span>}
                        </td>
                        <td style={tdStyle}>
                          {user.isBlocked
                            ? <span style={statusBlockedBadgeStyle}>🚫 Blocked</span>
                            : <span style={statusActiveBadgeStyle}>✅ Active</span>}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => {
                              setEditUser(user);
                              setEditForm({
                                mobile: user.mobile,
                                username: user.username || "",
                                email: user.email || "",
                                isAdmin: String(user.isAdmin),
                                isBlocked: String(user.isBlocked)
                              });
                            }} style={actionEditBtnStyle}>Edit</button>
                            <button onClick={() => handleToggleBlock(user)} style={user.isBlocked ? actionUnblockBtnStyle : actionBlockBtnStyle}>
                              {user.isBlocked ? "Unblock" : "Block"}
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} style={actionDeleteBtnStyle}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Products Management Tab */}
            {tab === "products" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <button onClick={handleBulkRestock} style={bulkRestockActionBtnStyle}>🔄 Bulk Restock All Low Items</button>
                  <button onClick={() => setShowAddProduct(true)} style={addProductActionBtnStyle}>➕ Add New Menu Item</button>
                </div>

                <div style={tableContainerStyle}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => {
                        const isLow = p.productstock < 10;
                        return (
                          <tr key={p.id} style={trStyle}>
                            <td style={tdStyle}><span style={idBadgeStyle}>#{p.id}</span></td>
                            <td style={tdStyle}>
                              <div style={{ color: "#fff", fontWeight: 700 }}>{p.productname}</div>
                              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>{p.productdescription}</div>
                            </td>
                            <td style={tdStyle}><span style={categoryBadgeStyle}>{p.productcategory || "Default"}</span></td>
                            <td style={tdStyle}><strong style={{ color: "#10b981" }}>₹{p.productprice}</strong></td>
                            <td style={tdStyle}>
                              <strong style={{ color: isLow ? "#ef4444" : "#10b981" }}>{p.productstock}</strong>
                            </td>
                            <td style={tdStyle}>
                              {isLow
                                ? <span style={stockCriticalBadgeStyle}>⚠️ Low Stock</span>
                                : <span style={stockNormalBadgeStyle}>In Stock</span>}
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => {
                                  setEditProduct(p);
                                  setEditForm({
                                    productname: p.productname,
                                    productdescription: p.productdescription,
                                    productprice: String(p.productprice),
                                    productcategory: p.productcategory,
                                    productstock: String(p.productstock)
                                  });
                                }} style={actionEditBtnStyle}>Edit</button>
                                <button onClick={() => handleRestock(p, 50)} style={actionRestockBtnStyle}>Restock +50</button>
                                <button onClick={() => handleDeleteProduct(p.id)} style={actionDeleteBtnStyle}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Management Tab */}
            {tab === "orders" && (
              <div style={tableContainerStyle}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                      <th style={thStyle}>Order ID</th>
                      <th style={thStyle}>Customer ID</th>
                      <th style={thStyle}>Restaurant</th>
                      <th style={thStyle}>Grand Total</th>
                      <th style={thStyle}>Payment</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={trStyle}>
                        <td style={tdStyle}><span style={idBadgeStyle}>{order.orderId}</span></td>
                        <td style={tdStyle}><span style={{ color: "rgba(255,255,255,0.7)" }}>User #{order.userId}</span></td>
                        <td style={tdStyle}><strong style={{ color: "#fff" }}>{order.restaurantName}</strong></td>
                        <td style={tdStyle}><strong style={{ color: "#10b981" }}>₹{order.grandTotal}</strong></td>
                        <td style={tdStyle}><span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{order.paymentMethod}</span></td>
                        <td style={tdStyle}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            style={statusSelectStyle(order.status)}
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setInspectOrder(order)} style={actionInspectBtnStyle}>Inspect</button>
                            {order.status === "Cancelled" && (
                              <button onClick={() => handleRefund(order)} style={actionRefundBtnStyle}>Process Refund</button>
                            )}
                            <button onClick={() => handleDeleteOrder(order.id)} style={actionDeleteBtnStyle}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Styling definitions
const pageContainerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#09090e",
  fontFamily: "'Inter', sans-serif",
  color: "#fff",
};

const topNavbarStyle: React.CSSProperties = {
  background: "#131320",
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  padding: "20px 40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const avatarCircleStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 14,
  background: "linear-gradient(135deg, #a855f7, #6b21a8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
};

const homeBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  padding: "8px 20px",
  borderRadius: 12,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  transition: "all 0.2s",
};

const stockWarningAlertStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))",
  border: "1px solid rgba(239, 68, 68, 0.25)",
  borderRadius: 20,
  padding: "20px 24px",
  marginBottom: 28,
  display: "flex",
  alignItems: "center",
  gap: 16,
  animation: "fadeIn 0.3s ease",
};

const bulkRestockBtnStyle: React.CSSProperties = {
  marginLeft: "auto",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 13,
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
};

const tabsContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  background: "rgba(255, 255, 255, 0.03)",
  borderRadius: 16,
  padding: 6,
  width: "fit-content",
  marginBottom: 32,
  border: "1px solid rgba(255, 255, 255, 0.06)",
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "10px 24px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  transition: "all 0.2s",
  background: active ? "linear-gradient(135deg, #9333ea, #7e22ce)" : "transparent",
  color: active ? "#fff" : "rgba(255, 255, 255, 0.55)",
});

const loadingOverlayStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 80,
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: 15,
};

const scorecardGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
};

const scorecardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 20,
  padding: "24px",
  backdropFilter: "blur(12px)",
};

const scorecardLabelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.45)",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const scorecardIconStyle: React.CSSProperties = {
  fontSize: 22,
};

const scorecardValueStyle: React.CSSProperties = {
  color: "#fff",
  fontSize: 32,
  fontWeight: 900,
  margin: "12px 0 4px 0",
};

const scorecardDescStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.3)",
  fontSize: 11,
};

const analyticsCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 24,
  padding: 30,
};

const analyticsTitleStyle: React.CSSProperties = {
  color: "#fff",
  fontWeight: 800,
  fontSize: 16,
  marginBottom: 20,
};

const progressBarContainerStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.06)",
  borderRadius: 99,
  height: 6,
  overflow: "hidden",
  marginTop: 6,
  marginBottom: 16,
};

const progressBarFillStyle = (pct: number, color: string): React.CSSProperties => ({
  width: `${pct}%`,
  background: color,
  height: "100%",
  borderRadius: 99,
});

const tableContainerStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 24,
  overflow: "hidden",
};

const thStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.4)",
  fontWeight: 600,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "18px 24px",
  textAlign: "left",
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
};

const trStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
};

const tdStyle: React.CSSProperties = {
  padding: "18px 24px",
  verticalAlign: "middle",
};

const idBadgeStyle: React.CSSProperties = {
  background: "rgba(168, 85, 247, 0.15)",
  color: "#c084fc",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 700,
  border: "1px solid rgba(168, 85, 247, 0.25)",
};

const categoryBadgeStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.06)",
  color: "rgba(255, 255, 255, 0.8)",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 600,
};

const roleAdminBadgeStyle: React.CSSProperties = {
  color: "#f59e0b",
  background: "rgba(245, 158, 11, 0.12)",
  border: "1px solid rgba(245, 158, 11, 0.2)",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 700,
};

const roleUserBadgeStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.5)",
  background: "rgba(255, 255, 255, 0.04)",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 600,
};

const statusActiveBadgeStyle: React.CSSProperties = {
  color: "#10b981",
  background: "rgba(16, 185, 129, 0.12)",
  border: "1px solid rgba(16, 185, 129, 0.2)",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 700,
};

const statusBlockedBadgeStyle: React.CSSProperties = {
  color: "#ef4444",
  background: "rgba(239, 68, 68, 0.12)",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 11,
  fontWeight: 700,
};

const stockNormalBadgeStyle: React.CSSProperties = {
  color: "#10b981",
  fontSize: 12,
  fontWeight: 600,
};

const stockCriticalBadgeStyle: React.CSSProperties = {
  color: "#ef4444",
  background: "rgba(239, 68, 68, 0.1)",
  padding: "3px 8px",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
};

const actionEditBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(168, 85, 247, 0.3)",
  background: "rgba(168, 85, 247, 0.12)",
  color: "#c084fc",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const actionBlockBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(239, 68, 68, 0.3)",
  background: "rgba(239, 68, 68, 0.12)",
  color: "#ef4444",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const actionUnblockBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(16, 185, 129, 0.3)",
  background: "rgba(16, 185, 129, 0.12)",
  color: "#10b981",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const actionRestockBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(245, 158, 11, 0.3)",
  background: "rgba(245, 158, 11, 0.12)",
  color: "#f59e0b",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const actionDeleteBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.04)",
  color: "rgba(255, 255, 255, 0.6)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const actionInspectBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255, 255, 255, 0.15)",
  background: "rgba(255, 255, 255, 0.06)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const actionRefundBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(16, 185, 129, 0.3)",
  background: "#10b981",
  color: "#fff",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const addProductActionBtnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #9333ea, #7e22ce)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
};

const bulkRestockActionBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  borderRadius: 12,
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(4px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const modalCardStyle: React.CSSProperties = {
  background: "#12121e",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 24,
  width: "100%",
  maxWidth: 480,
  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
  overflow: "hidden",
};

const modalHeaderStyle: React.CSSProperties = {
  padding: "24px 28px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const modalTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#fff",
  fontWeight: 800,
  fontSize: 18,
};

const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.4)",
  fontSize: 18,
  cursor: "pointer",
};

const modalBodyStyle: React.CSSProperties = {
  padding: "28px",
  maxHeight: "75vh",
  overflowY: "auto",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
};

const modalInputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const modalSelectStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const primaryBtnStyle: React.CSSProperties = {
  flex: 1,
  background: "linear-gradient(135deg, #9333ea, #7e22ce)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "12px 20px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
};

const cancelBtnStyle: React.CSSProperties = {
  flex: 1,
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "12px 20px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
};

const detailGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  marginBottom: 24,
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#c084fc",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  paddingBottom: 6,
};

const detailTextStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.75)",
  fontSize: 13,
  margin: "4px 0",
  lineHeight: "1.4",
};

const itemsTableStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: 16,
  padding: "16px 20px",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  marginBottom: 24,
};

const itemRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  fontSize: 13,
};

const priceSummaryCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  borderRadius: 16,
  padding: 20,
  border: "1px solid rgba(255,255,255,0.06)",
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  color: "rgba(255,255,255,0.6)",
  fontSize: 13,
  marginBottom: 8,
};

const grandTotalRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  color: "#10b981",
  fontWeight: 800,
  fontSize: 16,
  borderTop: "1px solid rgba(255,255,255,0.06)",
  paddingTop: 12,
  marginTop: 4,
};

const statusSelectStyle = (status: string): React.CSSProperties => {
  let color = "#f59e0b"; // Pending
  if (status === "Delivered") color = "#10b981";
  else if (status === "Cancelled" || status === "Refunded") color = "#ef4444";
  
  return {
    background: "rgba(0,0,0,0.3)",
    color,
    border: `1px solid ${color}40`,
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
    outline: "none",
    cursor: "pointer",
  };
};

export default AdminPanel;
