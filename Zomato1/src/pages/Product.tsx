import { useState, useEffect, CSSProperties } from "react";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/product`;
const IMAGE_BASE = `${API_BASE_URL}/uploads/`;

interface Product {
    id: number;
    productname: string;
    productdescription: string;
    productprice: number;
    productcategory: string;
    productstock: number;
    image: string | null;
}

export default function Product() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [productname, setProductname] = useState("");
    const [productdescription, setProductdescription] = useState("");
    const [productprice, setProductprice] = useState("");
    const [productcategory, setProductcategory] = useState("");
    const [productstock, setProductstock] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/all`);
            const data = await res.json();
            setProducts(data);
        } catch {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const resetForm = () => {
        setProductname("");
        setProductdescription("");
        setProductprice("");
        setProductcategory("");
        setProductstock("");
        setImage(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("productname", productname);
            formData.append("productdescription", productdescription);
            formData.append("productprice", productprice);
            formData.append("productcategory", productcategory);
            formData.append("productstock", productstock);
            if (image) formData.append("image", image);

            const res = await fetch(`${API_URL}/create`, {
                method: "POST",
                body: formData, // No Content-Type header — browser sets multipart automatically
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create product");

            setSuccess("Product added successfully!");
            resetForm();
            fetchProducts();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this product?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            setProducts((prev) => prev.filter((p) => p.id !== id));
            setSuccess("Product deleted.");
        } catch {
            setError("Failed to delete product");
        }
    };

    return (
        <div style={pageStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>🍽️ Product Management</h1>
                    <p style={subtitleStyle}>{products.length} products listed</p>
                </div>
                <button style={addBtnStyle} onClick={() => setShowForm((v) => !v)}>
                    {showForm ? "✕ Cancel" : "+ Add Product"}
                </button>
            </div>

            {/* Alerts */}
            {success && <div style={successStyle}>{success}</div>}
            {error && <div style={errorStyle}>{error}</div>}

            {/* Add Product Form */}
            {showForm && (
                <div style={formCardStyle}>
                    <h2 style={formTitleStyle}>Add New Product</h2>
                    <form onSubmit={handleSubmit} style={formStyle}>
                        {/* Image preview */}
                        {image && (
                            <div style={{ textAlign: "center", marginBottom: 12 }}>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    style={previewImgStyle}
                                />
                            </div>
                        )}

                        <div style={gridStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Product Name</label>
                                <input
                                    style={inputStyle}
                                    placeholder="e.g. Chicken Biryani"
                                    value={productname}
                                    onChange={(e) => setProductname(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Category</label>
                                <input
                                    style={inputStyle}
                                    placeholder="e.g. Main Course"
                                    value={productcategory}
                                    onChange={(e) => setProductcategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Price (₹)</label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    min={0}
                                    placeholder="299"
                                    value={productprice}
                                    onChange={(e) => setProductprice(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Stock</label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    min={0}
                                    placeholder="50"
                                    value={productstock}
                                    onChange={(e) => setProductstock(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    style={{ ...inputStyle, height: 72, resize: "vertical" }}
                                    placeholder="A short description of the product..."
                                    value={productdescription}
                                    onChange={(e) => setProductdescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={fileInputStyle}
                                    onChange={(e) =>
                                        setImage(e.target.files ? e.target.files[0] : null)
                                    }
                                />
                            </div>
                        </div>

                        <button type="submit" style={submitBtnStyle} disabled={submitting}>
                            {submitting ? "Saving..." : "Save Product"}
                        </button>
                    </form>
                </div>
            )}

            {/* Product Grid */}
            {loading ? (
                <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
                    Loading products...
                </p>
            ) : products.length === 0 ? (
                <div style={emptyStyle}>
                    <p style={{ fontSize: 48 }}>🍽️</p>
                    <p>No products yet. Click <strong>+ Add Product</strong> to get started.</p>
                </div>
            ) : (
                <div style={gridContainerStyle}>
                    {products.map((product) => (
                        <div key={product.id} style={cardStyle}>
                            <div style={imgWrapStyle}>
                                {product.image ? (
                                    <img
                                        src={`${IMAGE_BASE}${product.image}`}
                                        alt={product.productname}
                                        style={cardImgStyle}
                                    />
                                ) : (
                                    <div style={noImgStyle}>🍽️</div>
                                )}
                            </div>
                            <div style={cardBodyStyle}>
                                <div style={categoryBadgeStyle}>{product.productcategory}</div>
                                <h3 style={cardTitleStyle}>{product.productname}</h3>
                                <p style={cardDescStyle}>{product.productdescription}</p>
                                <div style={cardFooterStyle}>
                                    <span style={priceStyle}>₹{product.productprice}</span>
                                    <span style={stockStyle}>Stock: {product.productstock}</span>
                                </div>
                                <button
                                    style={deleteBtnStyle}
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 20px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
};

const headerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
};

const titleStyle: CSSProperties = {
    fontSize: 28,
    fontWeight: 800,
    color: "#1c1c1c",
    margin: 0,
};

const subtitleStyle: CSSProperties = {
    color: "#888",
    fontSize: 14,
    margin: "4px 0 0",
};

const addBtnStyle: CSSProperties = {
    backgroundColor: "#e23744",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 22px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.2s",
};

const successStyle: CSSProperties = {
    background: "#edf7ed",
    color: "#2e7d32",
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14,
};

const errorStyle: CSSProperties = {
    background: "#ffebee",
    color: "#c62828",
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14,
};

const formCardStyle: CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
    padding: "28px 32px",
    marginBottom: 36,
};

const formTitleStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: "#1c1c1c",
    marginBottom: 20,
    marginTop: 0,
};

const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
};

const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 20px",
};

const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
};

const labelStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
};

const inputStyle: CSSProperties = {
    border: "1.5px solid #e8e8e8",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
};

const fileInputStyle: CSSProperties = {
    border: "1.5px dashed #e23744",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    cursor: "pointer",
    background: "#fff5f5",
    width: "100%",
    boxSizing: "border-box",
};

const previewImgStyle: CSSProperties = {
    width: 100,
    height: 100,
    objectFit: "cover",
    borderRadius: 10,
    border: "2px solid #e23744",
};

const submitBtnStyle: CSSProperties = {
    marginTop: 18,
    backgroundColor: "#e23744",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    width: "100%",
};

const emptyStyle: CSSProperties = {
    textAlign: "center",
    color: "#888",
    marginTop: 60,
    fontSize: 16,
};

const gridContainerStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 24,
};

const cardStyle: CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
};

const imgWrapStyle: CSSProperties = {
    width: "100%",
    height: 160,
    overflow: "hidden",
    background: "#f5f5f5",
};

const cardImgStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
};

const noImgStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 48,
    color: "#ccc",
};

const cardBodyStyle: CSSProperties = {
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
};

const categoryBadgeStyle: CSSProperties = {
    display: "inline-block",
    background: "#fff5f5",
    color: "#e23744",
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 700,
    alignSelf: "flex-start",
};

const cardTitleStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: "#1c1c1c",
    margin: 0,
};

const cardDescStyle: CSSProperties = {
    fontSize: 12,
    color: "#888",
    margin: 0,
    lineHeight: 1.5,
};

const cardFooterStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
};

const priceStyle: CSSProperties = {
    fontWeight: 800,
    color: "#e23744",
    fontSize: 15,
};

const stockStyle: CSSProperties = {
    fontSize: 12,
    color: "#888",
};

const deleteBtnStyle: CSSProperties = {
    marginTop: 8,
    background: "transparent",
    border: "1.5px solid #e23744",
    color: "#e23744",
    borderRadius: 8,
    padding: "6px 0",
    width: "100%",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
};
