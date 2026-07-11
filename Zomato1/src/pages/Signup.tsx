import { useState, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

interface SignupProps {
    setData: React.Dispatch<React.SetStateAction<any>>;
}

function Signup({ setData }: SignupProps) {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            mobile,
            password,
        };

        try {
            const response = await fetch("http://zomato-production-7ecc.up.railway.app/api/users/signup", {
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

            console.log(data);
            alert("Signup Successful");

            // Store user and token
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            if (setData) {
                setData((prevData: any) => ({ ...prevData, isLoggedIn: true }));
            }

            setMobile("");
            setPassword("");

            // Redirect to home
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
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

            <form onSubmit={handleSubmit}>
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
                    Signup
                </button>
            </form>
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

export default Signup;