import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
    const [loginData, setLoginData] = useState({});
    const [loginStatus, setLoginStatus] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const Navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
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

    const handleGoogleLogin = useCallback(async (credentialResponse) => {
        try {
            setLoginStatus("");
            setIsLoading(true);
            
            console.log("Google login initiated");
            
            // Try backend authentication first
            try {
                const url = "https://monestry-backend.vercel.app/api/users/google-login";
                const result = await axios.post(url, {
                    credential: credentialResponse.credential
                });
                
                console.log("Backend Google login response:", result.data);
                
                if (result.data.token) {
                    localStorage.setItem('token', result.data.token);
                }
                
                const userData = {
                    email: result.data.email || result.data.user?.email,
                    name: result.data.name || result.data.user?.name,
                    picture: result.data.picture || result.data.user?.picture,
                    role: result.data.role || result.data.user?.role || 'user',
                    provider: 'google',
                    ...result.data.user
                };
                
                console.log("Google login - User data from backend:", userData);
                
                login(userData);
                setLoginStatus("Google login successful! Redirecting...");
                
                setTimeout(() => {
                    setIsLoading(false);
                    if (userData.role === 'admin') {
                        Navigate("/admin");
                    } else {
                        Navigate("/");
                    }
                }, 1000);
                
            } catch (backendError) {
                console.log("Backend authentication failed, using client-side decoding:", backendError);
                
                // Fallback to client-side decoding if backend fails
                const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
                
                const userData = {
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture,
                    role: 'user',
                    provider: 'google'
                };
                
                console.log("Google login - User data (client-side):", userData);
                
                login(userData);
                setLoginStatus("Google login successful! Redirecting...");
                
                setTimeout(() => {
                    setIsLoading(false);
                    Navigate("/");
                }, 1000);
            }
            
        } catch (err) {
            console.log('Google login error:', err);
            setLoginStatus("Google login failed. Please try again.");
            setIsLoading(false);
        }
    }, [Navigate, login]);

    useEffect(() => {
        const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; 
        
        if (!googleClientId || googleClientId === "your_google_client_id_here.apps.googleusercontent.com") {
            console.warn("Google Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file");
            return;
        }
        
        // Check if script is already loaded
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            // Script already exists, just initialize
            if (window.google) {
                initializeGoogleSignIn(googleClientId);
            }
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.google) {
                initializeGoogleSignIn(googleClientId);
            }
        };

        script.onerror = () => {
            console.error("Failed to load Google Identity Services script");
        };

        function initializeGoogleSignIn(clientId) {
            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleGoogleLogin,
                    auto_select: false,
                    cancel_on_tap_outside: true
                });
                
                const buttonElement = document.getElementById("google-signin-button"); 
                if (buttonElement) {
                    // Clear any existing content
                    buttonElement.innerHTML = '';
                    
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

        // Cleanup function - only remove if we added it
        return () => {
            const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (existingScript && existingScript === script) {
                document.head.removeChild(existingScript);
            }
        };
    }, [handleGoogleLogin]);



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
                <p className="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
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