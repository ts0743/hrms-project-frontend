import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id || user?.employeeId
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: user?.employeeId || user?.id,
    department: user?.department || "",
    designation: user?.position || "",
    phone: user?.phone || "",
    qualification: user?.qualification || "",
  });

  const handleSaveChanges = () =>{
    console.log('saved changes')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.employeeId && !user?.id) {
      toast({
        title: "Error",
        description: "Employee ID not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.put(
        `http://localhost:8083/hris/api/employee/${userId}`,
        formData
      );

      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Profile update failed",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and account settings</p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-lg border border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white pb-6 pt-6 px-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-white shadow-md">
              <AvatarFallback className="text-2xl font-bold">
                {user?.name?.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold">{user?.name}</CardTitle>
              <p className="text-sm text-indigo-100 mt-1">
                {user?.position || user?.role} • {user?.department || "N/A"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="bg-white px-6 py-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-medium text-gray-700">Department</Label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <Label className="font-medium text-gray-700">Position</Label>
                <Input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <Label className="font-medium text-gray-700">Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <Label className="font-medium text-gray-700">Qualification</Label>
                <Input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 px-6 shadow-md transition-all"
            >
              update profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}