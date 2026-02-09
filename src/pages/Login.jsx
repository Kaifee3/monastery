import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
    const [loginData, setLoginData] = useState({});
    const [loginStatus, setLoginStatus] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const Navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            // Clear any previous status and set loading
            setLoginStatus("");
            setIsLoading(true);
            
            const url = "https://monestry-backend.vercel.app/api/users/login";
            const result = await axios.post(url, loginData);
            
            console.log("Login response:", result.data);
            
            setLoginStatus("Login successful! Redirecting...");
            setIsLoading(false);
            
            if (result.data.token) {
                localStorage.setItem('token', result.data.token);
            }
            
            let userData;
            if (result.data.user) {
                userData = {
                    ...result.data.user,
                    email: result.data.user.email || loginData.email
                };
            } else if (result.data.role) {
                userData = {
                    ...result.data,
                    email: result.data.email || loginData.email
                };
            } else {
                userData = {
                    email: loginData.email,
                    role: 'user',
                    ...result.data
                };
            }
            
            console.log("User data to save:", userData);
            
            login(userData);
            
            setTimeout(() => {
                if (userData.role === 'admin') {
                    Navigate("/admin");
                } else {
                    Navigate("/");
                }
            }, 1500);
        } catch (err) {
            console.log(err);
            setLoginStatus("Invalid email or password");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            setLoginStatus("");
            setIsLoading(true);
            
            const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
            
            setLoginStatus("Google login successful! Redirecting...");
            setIsLoading(false);
            
            login({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                provider: 'google'
            });
            
            setTimeout(() => {
                Navigate("/");
            }, 1500);
        } catch (err) {
            console.log('Google login error:', err);
            setLoginStatus("Google login failed. Please try again.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; 
        
        if (!googleClientId || googleClientId === "your_google_client_id_here.apps.googleusercontent.com") {
            console.warn("Google Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file");
            return;
        }
        


        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.google) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: googleClientId,
                        callback: handleGoogleLogin,
                        auto_select: false,
                        cancel_on_tap_outside: true
                    });
                    
                    const buttonElement = document.getElementById("google-signin-button"); 
                    if (buttonElement) {
                        window.google.accounts.id.renderButton(
                            buttonElement,
                            { 
                                theme: "outline", 
                                size: "large",
                                text: "continue_with",
                                width: "100%",
                                logo_alignment: "left"
                            }
                        );
                    }
                } catch (error) {
                    console.error("Error initializing Google Sign-In:", error);
                }
            }
        };

        script.onerror = () => {
            console.error("Failed to load Google Identity Services script");
        };

        return () => {
            if (script.parentNode) { 
                document.head.removeChild(script);
            }
        };
    }, []);



    return (
        <div className="login-wrapper">
            <div className="form-container">
                <h2>Welcome Back</h2>
                {loginStatus && (
                    <div className={loginStatus.includes("successful") ? "success-message" : "error-message"}>
                        {loginStatus}
                    </div>
                )}
                <p>
                    <input
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                </p>
                <p>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                </p>
                <p>
                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </p>
                
                <div className="divider"> 
                    <span>or</span>
                </div>
                
                <div className="google-login-container">
                    <div id="google-signin-button"></div>
                </div>
                
                <div className="auth-link">
                    <p>Don't have an account? <Link to="/register">Click here to register</Link></p>
                </div>
            </div>
        </div>
  );
}