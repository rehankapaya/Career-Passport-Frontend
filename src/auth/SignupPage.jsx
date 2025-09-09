import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { apiurl } from '../api';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
export default function SignupPage() {
    const {userlogin} = useContext(UserContext)
  const [formData, setFormData] = useState({
    uname: '',
    email: '',
    password: '',
    role: ''
  });

  const { uname, email, password, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   async function handleSubmit(e) {
    e.preventDefault();
    
    try {
        
        const response = await axios.post(`${apiurl}/api/users/register`, formData);
        console.log('Signup successful:', response.data);
        toast.success("Signup Successful")
       

    } catch (error) {
        console.error('Signup failed:', error);
        toast.error(error.response?.data?.message || "Signup Failed");
    }

    console.log(formData)
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="uname" value={uname} onChange={handleChange} placeholder="Username" required />
        <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" required />
        <select name="role" placeholder="Role" value={role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="graduate">Graduate</option>
          <option value="professional">Professional</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
