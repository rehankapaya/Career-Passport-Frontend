import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { apiurl } from '../api';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {
    const { userlogin } = useContext(UserContext)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();

        try {

            const response = await axios.post(`${apiurl}/api/users/login`, formData);
            console.log('Login successful:', response.data);
            toast.success("Login Successful")
            userlogin(response.data.user);
            navigate("/")


        } catch (error) {
            console.error('Login failed:', error);
            toast.error(error.response?.data?.message || "Login Failed")
        }

        console.log(formData)
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" required />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}
