import { useState } from "react";

import { loginUser } from "../services/authService";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

function Login() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

      login(data);

      navigate("/chat");

      alert("Login Successful");

    } catch (error) {

      console.log(error);

      alert("Login Failed");

    }

  };


  return (
    <div style={{ padding: 20 }}>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;