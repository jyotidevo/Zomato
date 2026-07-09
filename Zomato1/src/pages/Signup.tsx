import { useState, FormEvent, CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8003/api/users";

function Signup() {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const userData = {
            mobile,
            password,
        };

        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || "Signup failed");
            }

            setMessage("Signup successful. Please login.");
            setMobile("");
            setPassword("");
            setTimeout(() => navigate("/login"), 800);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h2
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                    color: "#1c1c1c",
                    marginBottom: 24,
                    textAlign: "center",
                }}
            >
                Signup
            </h2>

            <form onSubmit={handleSignup}>
                {message && <div style={successStyle}>{message}</div>}
                {error && <div style={errorStyle}>{error}</div>}

                <input
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    style={inputStyle}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />

                <button type="submit" style={btnStyle}>
                    {isLoading ? "Creating account..." : "Signup"}
                </button>
            </form>
            <p style={linkTextStyle}>
                Already have an account? <Link to="/login" style={linkStyle}>Login</Link>
            </p>
        </div>
    );
}

const containerStyle: CSSProperties = {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "32px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};

const inputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    margin: "8px 0",
    border: "1.5px solid #e8e8e8",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "14px",
    fontFamily: "inherit",
};

const btnStyle: CSSProperties = {
    width: "100%",
    backgroundColor: "#e23744",
    color: "white",
    padding: "12px",
    margin: "16px 0 8px 0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    fontFamily: "inherit",
};

const successStyle: CSSProperties = {
    color: "#2e7d32",
    backgroundColor: "#edf7ed",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "14px",
};

const errorStyle: CSSProperties = {
    color: "#c62828",
    backgroundColor: "#ffebee",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "14px",
};

const linkTextStyle: CSSProperties = {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginTop: "12px",
};

const linkStyle: CSSProperties = {
    color: "#e23744",
    fontWeight: 700,
    textDecoration: "none",
};

export default Signup;
