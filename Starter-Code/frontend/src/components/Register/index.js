import React, { useState } from "react";
import axios from "axios";
import "./style.css";


const Register = () => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);


  // ========================================================
  const register = (e) => {
    e.preventDefault();
    axios
      .post("https://trash2cash-liav.onrender.com/user/register", {
        first_name,
        last_name,
        email,
        password,
        phone_number,
      })
      .then((result) => {
        console.log(result);
        setStatus(true);
        setMessage(result.data.message);
      })
      .catch((error) => {
        console.log(error);
        setStatus(false);
        setMessage(error.response.data.message);
      });
  };

  return (
    <div className="Form">
      <form onSubmit={register}>
      <br />
      <p className="Title">Register Form</p>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => {
          setFirst_name(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => {
          setLast_name(e.target.value);
        }}
      />
      <br />
      <input
        type="number"
        placeholder="Phone Number"
        onChange={(e) => {
          setPhone_number(e.target.value);
        }}
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br />
      <button >Register</button>
      </form>
      {status
        ? message && <div className="SuccessMessage">{message}</div>
        : message && <div className="ErrorMessage">{message}</div>}
    </div>
  );
};

export default Register;
