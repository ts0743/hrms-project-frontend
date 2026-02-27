import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Building2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/api";
import { useAuthStore } from "@/stores/authStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      const data = res.data;

      if (!data?.token) throw new Error("Token missing");

      login(data);
      setEmail("");
      setPassword("");

      switch (data.role) {
        case "ADMIN":
        case "HR":
          navigate("/admin/dashboard");
          break;
        case "EMPLOYEE":
        case "USER":
          navigate("/employee/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 401) setError("Invalid email or password");
      else if (err.response?.status === 500)
        setError("Server error — check backend");
      else setError("Cannot connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-[Inter] bg-[#E7ECF4] relative overflow-hidden">

      {/* Animated Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-indigo-400/30 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-blob1" />
        <div className="absolute w-[400px] h-[400px] bg-purple-400/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-blob2" />
      </div>

      {/* LEFT SIDE — PRODUCT SHOWCASE */}
      <div className="hidden md:flex w-1/2 bg-[#071A84] text-white p-12 flex-col justify-center relative overflow-hidden">

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-10 h-10" />
            <h1 className="text-3xl font-bold">HRIS Platform</h1>
          </div>

          <h2 className="text-4xl font-semibold leading-tight mb-6">
            <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Manage your workforce smarter
            </span>
          </h2>

          <p className="text-white/80 text-lg mb-10">
            Enterprise HR platform to manage employees, attendance, performance,
            and operations — all in one intelligent system.
          </p>

          {/* Fake Dashboard Preview */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 />
              <span className="font-semibold">Dashboard Overview</span>
            </div>

            <div className="space-y-3">
              <div className="h-3 bg-white/30 rounded w-4/5"></div>
              <div className="h-3 bg-white/30 rounded w-2/3"></div>
              <div className="h-3 bg-white/30 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — LOGIN */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <Card className="w-full max-w-md bg-white/60 backdrop-blur-md border border-white/70 shadow-2xl rounded-3xl transition hover:shadow-3xl">
          
          <div className="flex flex-col items-center pt-8">
            <div className="p-4 rounded-2xl bg-white shadow border">
              <Building2 className="w-8 h-8 text-[#071A84]" />
            </div>

            <h1 className="mt-6 text-3xl font-semibold text-gray-800">
              Welcome Back
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue
            </p>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div>
                <Label className="text-gray-700">Work Email</Label>
                <Input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-white/80 border-gray-300 focus:ring-2 focus:ring-[#071A84]"
                  required
                />
              </div>

              <div className="relative">
                <Label className="text-gray-700">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 pr-12 bg-white/80 border-gray-300 focus:ring-2 focus:ring-[#071A84]"
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg bg-[#071A84] hover:bg-[#06156a] transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px bg-gray-300 w-full" />
                <span className="text-sm text-gray-500">or</span>
                <div className="h-px bg-gray-300 w-full" />
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-3"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="google"
                />
                <span className="text-gray-700 font-medium">
                  Sign in with Google
                </span>
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              New employee?{" "}
              <Link to="/register" className="text-[#071A84] hover:underline">
                Register account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0)} 50%{transform:translate(40px,-40px)} }
        @keyframes blob2 { 0%,100%{transform:translate(0)} 50%{transform:translate(-40px,40px)} }
        .animate-blob1 { animation:blob1 20s infinite; }
        .animate-blob2 { animation:blob2 25s infinite; }
      `}</style>
    </div>
  );
};

export default Login;