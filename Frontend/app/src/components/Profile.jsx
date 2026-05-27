// import React, { useEffect, useState } from "react";
// import { userProfile , logoutUser} from "../api/authApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";

export default function Profile() {
  const nevigate = useNavigate();
  const {user, loading, logout} = useAuth();


  const handleLogout = async (e) => {
    try {
      const res = await logout();
      alert(res.data.message);
      nevigate("/");
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };
  if(loading){
    return <h1>loading...</h1>
  }
  return (
    <div>
      <Navbar></Navbar>
      <h1>Name: {user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
