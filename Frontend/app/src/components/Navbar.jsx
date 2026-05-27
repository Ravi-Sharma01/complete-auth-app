import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#111827",
        color: "white",
      }}
    >
      <h2 style={{ margin: 0 }}>MyBrand</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <NavLink to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </NavLink>

        {!loading && user ? (
          <>
            <span>Welcome, {user.name}</span>

            <NavLink
              to="/profile"
              style={{ color: "white", textDecoration: "none" }}
            >
              Profile
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/signup"
              style={{ color: "white", textDecoration: "none" }}
            >
              Signup
            </NavLink>

            <NavLink
              to="/signin"
              style={{ color: "white", textDecoration: "none" }}
            >
              Signin
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;