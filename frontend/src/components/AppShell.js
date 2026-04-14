import { Link, NavLink } from "react-router-dom";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

const privateLinks = (role) => [
  { to: "/dashboard", label: "Dashboard" },
  ...(role === "coordinator" ? [{ to: "/propose", label: "Propose Workshop" }] : []),
  { to: "/profile", label: "Profile" },
];

export default function AppShell({ children, user, onLogout }) {
  const links = user ? privateLinks(user.role) : publicLinks;

  return (
    <div className="grain-overlay min-h-screen text-stone-100">
      <header className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="glass-panel overflow-hidden rounded-[2rem] border border-white/10 px-5 py-4 shadow-[0_24px_70px_-36px_rgba(0,0,0,0.8)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs uppercase tracking-[0.28em] text-stone-400">
            <span>FOSSEE Workshop Portal</span>
            <span>{user ? `${user.role} mode` : "public preview"}</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link to="/" className="flex items-center gap-4">
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-stone-950">
                FOSSEE
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-100">Workshop booking, rebuilt for mobile-first clarity</p>
                <p className="text-xs text-stone-400">Keep the core structure. Upgrade the experience.</p>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition ${
                      isActive
                        ? "bg-white text-stone-950 shadow-lg"
                        : "text-stone-200 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-stone-300 md:block">
                    {user.full_name || user.username}
                  </div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-full border border-white/15 px-4 py-2 text-stone-200 transition hover:bg-white/10 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
