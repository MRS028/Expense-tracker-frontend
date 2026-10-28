import { useState } from "react";
import { login, register, setToken } from "../lib/api";
import { setUser } from "../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface Props {
  onLoginSuccess: () => void;
}

export default function AuthScreen({ onLoginSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await login({
        username: loginUsername,
        password: loginPassword,
      });
      setToken(data.access_token);
      setUser({ username: loginUsername });
      setMessage("Signed in. Loading your workspace…");
      setTimeout(onLoginSuccess, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
      });
      setMessage("Account created. You can sign in now.");
      setMode("login");
      setLoginUsername(regUsername);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: brand / hero */}
        <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-white text-slate-900 flex items-center justify-center font-bold">
                E
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Expense Tracker
              </span>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-semibold tracking-tight leading-tight">
              A calmer way to see where your money goes.
            </h1>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              Track spending, review your income, and filter transactions in
              seconds. Built for people who want clarity, not clutter.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <div className="text-2xl font-semibold">12k+</div>
                <div className="text-xs text-slate-400 mt-1">
                  Transactions logged
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold">99.9%</div>
                <div className="text-xs text-slate-400 mt-1">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">4.8/5</div>
                <div className="text-xs text-slate-400 mt-1">User rating</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Expense Tracker. All rights reserved.
          </div>
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {mode === "login" ? "Welcome back" : "Create an account"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Sign in to continue to your dashboard."
                    : "Enter your details to get started."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setMessage("");
                    }}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${
                      mode === "login"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                      setMessage("");
                    }}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${
                      mode === "register"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="mb-4 border-emerald-200 bg-emerald-50">
                    <AlertDescription className="text-emerald-700">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}

                {mode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="your username"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800"
                      disabled={loading}
                    >
                      {loading ? "Signing in…" : "Sign in"}
                    </Button>
                  </form>
                )}

                {mode === "register" && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input
                        id="reg-username"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="choose a username"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800"
                      disabled={loading}
                    >
                      {loading ? "Creating account…" : "Create account"}
                    </Button>
                  </form>
                )}

                <p className="mt-6 text-center text-xs text-slate-500">
                  By continuing you agree to our{" "}
                  <a href="#" className="underline hover:text-slate-700">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-slate-700">
                    Privacy Policy
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}