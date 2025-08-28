// pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Shadcn Alert
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { login, signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = location.pathname === "/login";

  // Auto-hide success alert after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      const trimmedEmail = email.trim();
      if (!password) {
        setError("Password is required");
        return;
      }

      if (isLogin) {
        await login(trimmedEmail, password);
        setSuccess("Logged in successfully!");
      } else {
        await signup(name, trimmedEmail, password, imageUrl);
        setSuccess("Account created successfully!");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setSuccess("");
      await googleLogin();
      setSuccess("Logged in with Google successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMode = () => {
    navigate(isLogin ? "/signup" : "/login", { replace: true });
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
    setImageUrl("");
  };

  const inputClass = "focus:ring-2 focus:ring-pink-400 focus:border-pink-400";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/Vp9ch1qn/school-supplies-back-school-pattern.png')",
        }}
      ></div>
      <div className="absolute inset-0 -z-10 bg-[#f8b6ab]/60"></div>

      <Card className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/80 border border-pink-200 relative z-10">
        <CardHeader className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-center py-6">
          <CardTitle className="text-3xl font-extrabold tracking-wide">
            Student Life Toolkit
          </CardTitle>
          <CardDescription className="text-white/90 mt-2 text-sm">
            {isLogin
              ? "Welcome back! Log in to access your dashboard."
              : "Create your account and start your journey."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="imageUrl"
                    className="font-medium text-gray-700"
                  >
                    Profile Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1 relative">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                className="absolute right-3 top-[36px] -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <CardFooter className="flex flex-col gap-3 mt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white shadow-lg"
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-2 border-pink-300 hover:border-pink-500 hover:text-pink-600 shadow-sm"
                onClick={handleGoogleLogin}
              >
                <FcGoogle size={20} /> Login with Google
              </Button>
            </CardFooter>
          </form>

          <CardAction className="mt-6 text-center">
            <Button
              variant="link"
              className="text-pink-600 hover:underline font-medium"
              onClick={toggleMode}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Button>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
}
