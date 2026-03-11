import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const ADMIN_ID = "admin";
    const ADMIN_PASS = "1234";

    if (username === ADMIN_ID && password === ADMIN_PASS) {

      localStorage.setItem("adminLoggedIn", "true");

      navigate("/admin-dashboard");

    } else {

      alert("Invalid Admin Credentials");

    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          type="text"
          placeholder="Admin ID"
          className="border w-full p-2 mb-4 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Login
        </button>

      </form>

    </div>
  );
}