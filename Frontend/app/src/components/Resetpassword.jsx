import { useState } from 'react'
import Navbar from './Navbar';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import {useAuth }from '../context/authContext'

export default function Resetpassword() {
  const [searchParams] = useSearchParams();
  const nevigate = useNavigate();
  const {setPassword} = useAuth();
  const [formData, setFormData] = useState({
    password:'',
    confirmPassword:'',
  });


  const handleOnchange =(e)=>{
    setFormData({...formData,
      [e.target.name]:e.target.value
  })
  }

  const handleOnSubmit =  async(e)=>{
    e.preventDefault();
   try {
     const token = searchParams.get('token');
     if(!token) {
      const err =  new Error('password token undefined')
      return alert(err)
     }
     if(formData.password !== formData.confirmPassword) {
      return alert('password and confirm password do not match')
     }
     const payload = {token:token, password:formData.password }
     const res = await setPassword(payload);
     alert(res?.data?.message);
     nevigate('/signin', {replace:true})
   }
   catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || 'something went wrong')
   }}
  return (
    <>
    <Navbar/>
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
  <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
    <h3 className="text-center mb-4 text-secondary">Reset Password</h3>
    
    {/* FIXED: onSubmit belongs on the <form> tag, not the button */}
    <form onSubmit={handleOnSubmit} >
      
      {/* New Password Input */}
      <div className="mb-3">
        <label className="form-label text-muted small">New Password</label>
        <input 
          type="password"
          name="password" // Added name attribute for easier state handling
          className="form-control"
          placeholder="Enter new password"
          value={formData?.password || ''} // Fixed casing from FormData to formData
          onChange={handleOnchange}
          required
        />
      </div>

      {/* Confirm Password Input */}
      <div className="mb-4">
        <label className="form-label text-muted small">Confirm New Password</label>
        <input 
          type="password"
          name="confirmPassword"
          className="form-control"
          placeholder="Confirm your password"
          value={formData?.confirmPassword || ''} 
          onChange={handleOnchange}
          required
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn btn-primary w-100 py-2"
      >
        Update Password
      </button>
    </form>
  </div>
</div>
</>

  )
}
