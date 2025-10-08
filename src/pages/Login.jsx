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
            
            const url = "https://cafe-backend-umber.vercel.app/api/users/login";
            const result = await axios.post(url, loginData);
            
            // Show success message
            setLoginStatus("Login successful! Redirecting...");
            setIsLoading(false);
            
            // Set authentication state with user data
            login({
                email: loginData.email,
                ...result.data // Include any additional user data from the response
            });
            
            // Add a small delay to show the success message before navigating
            setTimeout(() => {
                Navigate("/");
            }, 1500);
        } catch (err) {
            console.log(err);
            setLoginStatus("Invalid email or password");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            // Clear any previous status and set loading
            setLoginStatus("");
            setIsLoading(true);
            
            // Decode the JWT token from Google
            const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
            
            // Show success message
            setLoginStatus("Google login successful! Redirecting...");
            setIsLoading(false);
            
            // Set authentication state with Google user data
            login({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                provider: 'google'
            });
            
            // Add a small delay to show the success message before navigating
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
        // Check if Google Client ID is configured
        const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        
        if (!googleClientId || googleClientId === "your_google_client_id_here.apps.googleusercontent.com") {
            console.warn("Google Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file");
            return;
        }
        


        // Load Google Identity Services script
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
                    
                    // Only render button if element exists
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
            // Clean up script only if it exists
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
                
                {/* Show Google login - will show warning if not properly configured */}
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