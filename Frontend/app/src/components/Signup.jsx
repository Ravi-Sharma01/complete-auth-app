import React, { useState } from "react";
import Navbar from "./Navbar";
import {useNavigate} from 'react-router-dom'
import {registerUser} from '../api/authApi'
const Signup = () => {
  const signinNavigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData)
      console.log(response.data)
    //   alert(response.data.message);

    } catch (error) {
       console.log(error.message);
      
    }
    // try {
    //   const response = await axios.post('http://localhost:3000/api/auth/registerUser',
    //     {
    //       name: formData.name,
    //       email:formData.email,
    //       password:formData.password
    //     }
    //   )

    //   console.log(response.data)
    //   alert(response.data.message);
      
    // } catch (error) {
    //   console.log(error.message);
    // }

    setFormData({  name: "",
    email: "",
    password: "",})
    console.log(formData);
  };

  return (
    <>
    <Navbar />
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow p-4 border-0 rounded-4">
            <h2 className="text-center mb-4">Sign Up</h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-lg"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
              >
                Submit
              </button>

              {/* Sign In Link */}
              <p className="text-center mt-3 mb-0">
                Already have an account?{" "}
                <button type="button" onClick={()=>signinNavigate('/signin')} className="text-decoration-none fw-bold btn btn-primary">
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;