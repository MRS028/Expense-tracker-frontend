import { useState } from "react";
import { isLoggedIn, getUser } from "./lib/auth";
import { clearToken } from "./lib/api";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const user = getUser();

  const handleLogout = () => {
    clearToken();
    setAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}