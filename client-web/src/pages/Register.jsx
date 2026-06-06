import { useState } from "react";

import { registerUser } from "../services/authService";

import { useNavigate } from "react-router-dom";

function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();


  const handleChange = (e) => {

  if (e.target.name === "avatar") {

    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });

  } else {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  }

};

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const form = new FormData();

    form.append(
      "username",
      formData.username
    );

    form.append(
      "email",
      formData.email
    );

    form.append(
      "password",
      formData.password
    );

    form.append(
      "avatar",
      formData.avatar
    );


    const data = await registerUser(form);

    console.log(data);

    alert("Registration Successful");

    navigate("/login");

  } catch (error) {

    console.log(error);

    alert("Registration Failed");

  }
};


  return (
    <div style={{ padding: 20 }}>

      <h1>Register</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <br /><br />

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

        <input
        type="file"
        name="avatar"
        accept="image/*"
        onChange={handleChange}
        />

    <br></br> <br></br>

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;