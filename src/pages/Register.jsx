import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"
export default function Register() {
    const navigate = useNavigate();
    const [user,setUser]=useState({})
    const [error,setError]=useState()
    const handleSubmit=async()=>{
        try{
            // const url="http://localhost:8080/api/users/register"
            const url="https://cafe-backend-umber.vercel.app/api/users/register"
            const result= await axios.post(url,user)
            setError("Successfully Register")
            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Wait 2 seconds to show success message before redirecting
        }
        catch(err){
            console.log(err)
            setError("Something went wrong")
        }
        console.log(user)
    }
  return (
    <div className="register-wrapper">
      <div className="form-container">
        <h2>Create Your Account</h2>
        {error && <div className={error.includes("successfully") ? "success-message" : "error-message"}>{error}</div>}
        <p>
          <input 
            type="text" 
            placeholder="First Name" 
            onChange={(e) => setUser({ ...user, firstName: e.target.value })} 
          />
        </p>
        <p>
          <input 
            type="text" 
            placeholder="Last Name" 
            onChange={(e) => setUser({ ...user, lastName: e.target.value })} 
          />
        </p>
        <p>
          <input 
            type="email" 
            placeholder="Email Address" 
            onChange={(e) => setUser({ ...user, email: e.target.value })} 
          />
        </p>
        <p>
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setUser({ ...user, password: e.target.value })} 
          />
        </p>
        <p>
          <button onClick={handleSubmit}>Create Account</button>
        </p>
        <div className="auth-link">
          <p>Already have an account? <Link to="/login">Click here to login</Link></p>
        </div>
      </div>
    </div>
  );
}