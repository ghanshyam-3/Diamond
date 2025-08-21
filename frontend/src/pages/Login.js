import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token + user in localStorage
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded w-96 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Diamond Login</h2>
          <p className="text-sm text-gray-600">
            New employee?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Create an account
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

        {error && (
          <p className="bg-red-200 text-red-600 p-2 rounded text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      </div>
    </div>
  );
}
