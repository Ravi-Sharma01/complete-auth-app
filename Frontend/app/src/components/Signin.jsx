import { useState , useEffect} from "react";
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

//email validation regx helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//signin Component
export default function Signin() {
  const { login, forgetPasswordRequest, user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (!loading && user) {
      navigate("/profile", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  //handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = formData.email.trim();

      if (!email || !formData.password.trim()) {
        return alert("please enter  a email or password");
      }
      if (!isValidEmail(email)) return alert("please enter a  valid email");

      const payload = {
        email,
        password: formData.password.trim(),
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

  //for request to password reset link
  const handleForgetPassword = async (e) => {
    try {
      const email = formData.email.trim();
      if (!email) return alert("please enter a email");

      if (!isValidEmail(email)) {
        return alert("please enter a valid email");
      }

      const res = await forgetPasswordRequest({ email });
      alert(res?.data?.message);
      setFormData({ email: "" });
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
                  />
                </div>
                <p>
                  Forgot your password?{" "}
                  <button
                    type="button"
                    onClick={handleForgetPassword}
                    className="btn btn-link p-0 m-0 align-baseline" // Bootstrap classes to make it look like a text link
                  >
                    Reset Password?
                  </button>{" "}
                </p>

                {/* Button */}
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Submit
                </button>

                {/* Sign In Link */}
                <p className="text-center mt-3 mb-0">
                  you Dont have Account?{" "}
                  <button
                    type="button"
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
