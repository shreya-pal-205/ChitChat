import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  //Load user from localStorage on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async ({ emailOrMobile, password }) => {
    try {
      const res = await api.post("/auth/login", {
        emailOrMobile: emailOrMobile.trim(),
        password: password.trim(),
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // SIGNUP
  const signup = async ({ name, email, mobile, password }) => {
    try {
      const res = await api.post("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password: password.trim(),
      });

      return res.data.message;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];

    navigate("/login"); 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
