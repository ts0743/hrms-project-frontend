import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);

  const userId = user?.id || user?.employeeId;

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    phone: "",
    qualification: "",
  });

  const fetchProfile = async () => {
    if (!userId) return;

    const token = localStorage.getItem("hris_token");

    if (!token) {
      console.error("JWT token missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8083/hris/api/employee/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setProfile(data);

      setFormData({
        department: data.department || "",
        designation: data.designation || "",
        phone: data.phone || "",
        qualification: data.qualification || "",
      });

    } catch (error) {
      console.error("Fetch profile error:", error);

      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("hris_token");

    if (!token) {
      console.error("JWT token missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Only change - using dedicated profile update endpoint
      await axios.put(
        `http://localhost:8083/hris/api/employee/employee/${userId}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      fetchProfile();

    } catch (error) {
      console.error("Update error:", error);

      toast({
        title: "Update Failed",
        description: "Unable to update profile",
        variant: "destructive",
      });

    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="text-gray-500">
          Manage your personal information
        </p>
      </div>

      <Card className="shadow-lg border rounded-xl">

        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">

          <div className="flex items-center gap-4">

            <Avatar className="w-20 h-20 border-2 border-white">

              <AvatarFallback className="text-xl font-bold">
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </AvatarFallback>

            </Avatar>

            <div>

              <CardTitle>
                {profile.firstName} {profile.lastName}
              </CardTitle>

              <p className="text-sm text-indigo-100">
                {profile.designation || "N/A"} •{" "}
                {profile.department || "N/A"}
              </p>

              <p className="text-xs text-indigo-200 mt-1">
                {profile.email}
              </p>

            </div>

          </div>

        </CardHeader>

        <CardContent className="p-6">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <Label>Department</Label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Designation</Label>
                <Input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Qualification</Label>
                <Input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />
              </div>

            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}