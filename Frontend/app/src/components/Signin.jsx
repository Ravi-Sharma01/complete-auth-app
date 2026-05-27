import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
// import {loginUser} from '../api/authApi'
import { useAuth } from "../context/authContext";

export default function Signin() {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      const response = await login(payload);
      alert(response.data.message);
      navigate("/profile");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      alert(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="row w-100 justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-4">
            <div className="card shadow p-4 border-0 rounded-4">
              <h2 className="text-center mb-4">Sign In</h2>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Button */}
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Submit
                </button>

                {/* Sign In Link */}
                <p className="text-center mt-3 mb-0">
                  you Dont have Account?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-decoration-none fw-bold btn btn-primary"
                  >
                    Sign UP
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
