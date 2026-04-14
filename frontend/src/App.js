import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { api } from "./lib/api";
import DashboardPage from "./pages/dashboard";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import ProposeWorkshopPage from "./pages/propose";
import RegisterPage from "./pages/register";
import WorkshopDetailPage from "./pages/workshop-detail";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [session, setSession] = useState({ user: null, meta: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getSession()
      .then((data) => {
        if (mounted) {
          setSession({ user: data.user, meta: data.meta });
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const authValue = useMemo(
    () => ({
      user: session.user,
      meta: session.meta,
      setSession,
    }),
    [session.user, session.meta]
  );

  async function handleLogout() {
    await api.logout();
    setSession((current) => ({ ...current, user: null }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-stone-100">
        <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm tracking-[0.3em] text-stone-300">
          Loading portal
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppShell user={authValue.user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage auth={authValue} />} />
          <Route path="/login" element={authValue.user ? <Navigate to="/dashboard" replace /> : <LoginPage auth={authValue} />} />
          <Route path="/register" element={authValue.user ? <Navigate to="/dashboard" replace /> : <RegisterPage auth={authValue} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={authValue.user}>
                <DashboardPage auth={authValue} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/propose"
            element={
              <ProtectedRoute user={authValue.user}>
                <ProposeWorkshopPage auth={authValue} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={authValue.user}>
                <ProfilePage auth={authValue} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops/:workshopId"
            element={
              <ProtectedRoute user={authValue.user}>
                <WorkshopDetailPage auth={authValue} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
