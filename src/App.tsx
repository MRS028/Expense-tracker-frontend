import { useState } from "react";
import { isLoggedIn, getUser } from "./lib/auth";
import { clearToken } from "./lib/api";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => isLoggedIn());
  const [user, setUser] = useState(() => getUser());

  const handleLogout = () => {
    clearToken();
    setAuthenticated(false);
    setUser(null);
  };

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
  };

  if (!authenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}