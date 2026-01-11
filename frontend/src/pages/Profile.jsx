import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setForm(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    await api.put("/users/me", form);
    alert("Profile updated");
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete account permanently?")) return;

    await api.delete("/users/me");
    logout();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EFF5D2] via-[#C6D870] to-[#EFF5D2] px-4">
      
      <Card className="w-full max-w-md shadow-xl border-none bg-white/90 backdrop-blur">
        <CardContent className="space-y-5 p-6">

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8FA31E] to-[#556B2F] flex items-center justify-center text-white text-3xl font-bold shadow">
              {form.name?.[0] || "U"}
            </div>
            <h2 className="text-xl font-bold text-[#556B2F]">
              My Profile
            </h2>
            <p className="text-sm text-gray-600">
              Manage your account details
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <div>
              <Label className="text-[#556B2F]">Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-[#8FA31E]"
              />
            </div>

            <div>
              <Label className="text-[#556B2F]">Email</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-[#8FA31E]"
              />
            </div>

            <div>
              <Label className="text-[#556B2F]">Mobile</Label>
              <Input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-[#8FA31E]"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-3 pt-2">
            <Button
              className="w-full bg-gradient-to-br from-[#8FA31E] to-[#556B2F] hover:opacity-90 text-white"
              onClick={updateProfile}
            >
              💾 Update Profile
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={deleteAccount}
            >
              🗑 Delete Account
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
