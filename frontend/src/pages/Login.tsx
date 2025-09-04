import React, { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const { logIn, logOut, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = () => {
        logIn(); // Redirects to Keycloak login page
    };

    const handleLogout = () => {
        logOut();
        toast.success("Logged out successfully!");
    };

    // 🔑 Redirect after successful login
    useEffect(() => {
        if (token) {
            navigate("/dashboard"); // redirect to dashboard
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Logo */}
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">V</span>
                </div>

                {/* Title */}
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                    Virunga Management System
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Secure login with Keycloak (PKCE)
                </p>

                {/* Buttons */}
                {token ? (
                    <div>
                        <p className="text-green-600 text-sm mb-4">You are logged in!</p>
                        <button
                            onClick={handleLogout}
                            className="btn-primary w-full py-3 text-base font-medium"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="btn-primary w-full py-3 text-base font-medium"
                    >
                        Sign in with Keycloak
                    </button>
                )}
            </div>
        </div>
    );
};

export default Login;
