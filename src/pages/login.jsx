import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Building2,
  Loader2,
  Users,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/api";
import { useAuthStore } from "@/stores/authStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Enter a valid work email address.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await authService.login({
        email: form.email,
        password: form.password,
      });

      const data = res.data;

      if (!data?.token) throw new Error("Invalid server response");

      await login(data);

      if (form.remember) {
        localStorage.setItem("hris_user_email", form.email);
      } else {
        localStorage.removeItem("hris_user_email");
      }

      // ✅ All roles navigate to "/" - ProtectedRoute in App.jsx handles role-based access
      navigate("/");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try later.");
      } else {
        setError("Unable to connect. Check backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#eef2ff] via-white to-[#eef2ff] font-[Inter]">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-20 flex-col justify-center">

        <div className="max-w-lg space-y-10">

          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-2xl">
              <Building2 size={32} />
            </div>
            <h1 className="text-3xl font-semibold">HRIS Platform</h1>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Workforce intelligence
              <br />
              made effortless.
            </h2>

            <p className="mt-4 text-white/70 text-lg">
              Everything from employee lifecycle to performance insights —
              unified in one elegant platform.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-6 shadow-2xl">

            <div className="grid grid-cols-3 gap-4">

              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Users className="mx-auto mb-2 opacity-80" size={20} />
                <p className="text-xl font-semibold">50</p>
                <p className="text-xs text-white/60">Employees</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <CalendarCheck className="mx-auto mb-2 opacity-80" size={20} />
                <p className="text-xl font-semibold">03</p>
                <p className="text-xs text-white/60">On Leave</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Clock className="mx-auto mb-2 opacity-80" size={20} />
                <p className="text-xl font-semibold">92%</p>
                <p className="text-xs text-white/60">Attendance Rate</p>
              </div>

            </div>

            <div className="flex items-end gap-3 h-20 pt-4">
              <div className="w-4 bg-white/30 rounded-lg h-8"></div>
              <div className="w-4 bg-white/30 rounded-lg h-14"></div>
              <div className="w-4 bg-white/30 rounded-lg h-10"></div>
              <div className="w-4 bg-white/30 rounded-lg h-16"></div>
              <div className="w-4 bg-white/30 rounded-lg h-12"></div>
              <div className="w-4 bg-white/30 rounded-lg h-18"></div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-gray-200">

          <div className="text-center pt-10">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-[#0f172a]/10">
              <Building2 className="text-[#0f172a]" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-gray-800">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue
            </p>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div>
                <Label>Work Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-2 focus:ring-2 focus:ring-[#0f172a]"
                />
              </div>

              <div className="relative">
                <Label>Password</Label>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-2 pr-10 focus:ring-2 focus:ring-[#0f172a]"
                />

                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-800"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[#0f172a] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0f172a] hover:bg-black text-white rounded-xl transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0f172a] hover:underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;