import React from "react";
import {NavLink} from 'react-router-dom'

const Navbar = () => {
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
      {/* Brand Name */}
      <h2 style={{ margin: 0 }}>MyBrand</h2>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <NavLink
          to="/"
          style={{ color: "white", textDecoration: "none" }}
        >
          Home
        </NavLink>

        <NavLink
          to="/signup"
          style={{ color: "white", textDecoration: "none" }}
        >
          Signup
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;