import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ emailOrMobile, password });
      navigate("/users");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-[#556B2F] text-white">
        <h1 className="text-4xl font-bold mb-4">
          ChitChat
        </h1>

        <p className="text-lg text-[#EFF5D2]">
          A modern real-time chat platform to stay connected with your friends
          and family. Fast, secure and beautifully simple.
        </p>

        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/chat-with-a-mobile-application-illustration-svg-download-png-7772301.png"
          alt="Chat Illustration"
          className="w-[80%] drop-shadow-xl"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center bg-[#EFF5D2] px-4">
        <Card className="w-full max-w-[360px] shadow-2xl border-none">
          <CardContent className="p-6 space-y-5">
            
            <h2 className="text-2xl font-bold text-center text-black">
              Welcome Back 👋
            </h2>

            <p className="text-sm text-center text-gray-600">
              Login to continue chatting
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-black">Email or Mobile</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter email or mobile"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-black">Password</Label>
                <Input
                  type="password"
                  className="mt-1"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button className="w-full bg-[#8FA31E] hover:bg-[#556B2F] text-white">
                Login
              </Button>
            </form>

            {/* SIGNUP LINK */}
            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#556B2F] hover:underline"
              >
                Sign up
              </Link>
            </p>

            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Login;
