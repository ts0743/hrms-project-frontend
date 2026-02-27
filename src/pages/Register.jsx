import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.role) return setError("Please select a role");
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");
    if (formData.password.length < 8)
      return setError("Password must be at least 8 characters");

    setLoading(true);

    try {
      await authService.register({
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 400) setError("Email already registered");
      else setError("Registration failed. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">

      {/* ===== Animated Background ===== */}
      <div className="absolute inset-0">
        <div className="absolute w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[140px] opacity-40 animate-blob1 top-[-200px] left-[-200px]" />
        <div className="absolute w-[700px] h-[700px] bg-sky-500 rounded-full blur-[140px] opacity-30 animate-blob2 bottom-[-200px] right-[-200px]" />
        <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full blur-[140px] opacity-30 animate-blob3 top-[40%] left-[40%]" />
      </div>

      {/* ===== Glass Register Card ===== */}
      <Card className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center pt-8">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg animate-logo">
            <Building2 className="w-10 h-10 text-white" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Create HRIS Account
          </h1>

          <p className="text-sm text-gray-300 mt-1">
            Enterprise employee onboarding
          </p>
        </div>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="p-3 text-sm text-red-300 bg-red-500/20 border border-red-400/30 rounded-lg text-center animate-slide">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="relative">
              <Input
                name="fullName"
                placeholder=" "
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                className="peer pt-6 pb-2 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-indigo-400 rounded-lg"
                required
              />
              <Label className={`floating-label ${formData.fullName && "active"}`}>
                Full Name
              </Label>
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                name="email"
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="peer pt-6 pb-2 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-indigo-400 rounded-lg"
                required
              />
              <Label className={`floating-label ${formData.email && "active"}`}>
                Work Email
              </Label>
            </div>

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="h-12 w-full rounded-lg bg-white/10 border border-white/20 text-white px-3 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" className="text-black">Select Role</option>
              <option value="EMPLOYEE" className="text-black">Employee</option>
              <option value="HR" className="text-black">HR</option>
              <option value="ADMIN" className="text-black">Admin</option>
            </select>

            {/* Password */}
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="peer pt-6 pb-2 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-indigo-400 rounded-lg pr-12"
                required
              />
              <Label className={`floating-label ${formData.password && "active"}`}>
                Password
              </Label>

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                name="confirmPassword"
                type="password"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="peer pt-6 pb-2 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-indigo-400 rounded-lg"
                required
              />
              <Label className={`floating-label ${formData.confirmPassword && "active"}`}>
                Confirm Password
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-lg relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02]"
            >
              <span className="button-shine"></span>
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            Already registered?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ===== Styles ===== */}
      <style>{`
        .floating-label {
          position:absolute;
          left:12px;
          top:18px;
          color:#cbd5e1;
          transition:0.2s;
          font-size:14px;
        }
        .floating-label.active,
        .peer:focus ~ .floating-label {
          top:6px;
          font-size:12px;
          color:#fff;
        }

        @keyframes fadeIn {
          from { opacity:0; transform:translateY(40px); }
          to { opacity:1; transform:translateY(0); }
        }
        .animate-fade-in { animation:fadeIn 1s ease; }

        @keyframes blob1 { 0%,100%{transform:translate(0)} 50%{transform:translate(60px,-40px)} }
        @keyframes blob2 { 0%,100%{transform:translate(0)} 50%{transform:translate(-60px,40px)} }
        @keyframes blob3 { 0%,100%{transform:translate(0)} 50%{transform:translate(40px,40px)} }

        .animate-blob1 { animation:blob1 20s infinite; }
        .animate-blob2 { animation:blob2 25s infinite; }
        .animate-blob3 { animation:blob3 22s infinite; }

        @keyframes logo { 0%{transform:scale(.7);opacity:0} 100%{transform:scale(1);opacity:1} }
        .animate-logo { animation:logo .8s ease; }

        .button-shine {
          position:absolute;
          inset:0;
          background:linear-gradient(120deg,transparent,rgba(255,255,255,.4),transparent);
          transform:translateX(-100%);
          transition:0.6s;
        }
        button:hover .button-shine { transform:translateX(100%); }

        @keyframes slide { from{opacity:0; transform:translateY(-10px);} to{opacity:1;} }
        .animate-slide { animation:slide .4s ease; }
      `}</style>
    </div>
  );
};

export default Register;
