import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-[#556B2F] text-white">
        <h1 className="text-4xl font-bold mb-4">
          Join the Conversation with ChitChat 🚀
        </h1>

        <p className="text-lg text-[#EFF5D2]">
          Create your account and start real-time chatting with friends and
          teams. Simple, secure and fast.
        </p>

        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/chat-with-a-mobile-application-illustration-svg-download-png-7772301.png"
          alt="Signup Illustration"
          className="w-[80%] drop-shadow-xl"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center bg-[#EFF5D2] px-4">
        <Card className="w-full max-w-[380px] shadow-2xl border-none">
          <CardContent className="p-6 space-y-5">
            
            <h2 className="text-2xl font-bold text-center text-black">
              Create Account ✨
            </h2>

            <p className="text-sm text-center text-gray-600">
              Sign up to start chatting
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-black">Full Name</Label>
                <Input
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-black">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-black">Mobile</Label>
                <Input
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-black">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button className="w-full bg-[#8FA31E] hover:bg-[#556B2F] text-white">
                Sign Up
              </Button>
            </form>

            {/* LOGIN LINK */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#556B2F] hover:underline"
              >
                Login
              </Link>
            </p>

            <p className="text-xs text-center text-gray-500">
              By signing up, you agree to our Terms & Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Signup;
