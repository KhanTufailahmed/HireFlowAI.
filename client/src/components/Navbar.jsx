import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, X, Briefcase, PlusCircle, CheckSquare, LayoutDashboard } from "lucide-react";
import MagneticButton from "./MagneticButton";

const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs animate-navbar-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to={isAuthenticated ? (role === "admin" ? "/admin" : "/jobs") : "/"} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                HireFlow <span className="text-indigo-600">AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
              {isAuthenticated ? (
                role === "admin" ? (
                  <>
                    <NavLink
                      to="/admin"
                      end
                      className={({ isActive }) =>
                        `relative py-5 px-1 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                          isActive
                            ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                            : "text-slate-600 hover:text-slate-900"
                        }`
                      }
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/admin/jobs"
                      className={({ isActive }) =>
                        `relative py-5 px-1 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                          isActive
                            ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                            : "text-slate-600 hover:text-slate-900"
                        }`
                      }
                    >
                      <Briefcase className="w-4 h-4" />
                      My Jobs
                    </NavLink>
                    <NavLink
                      to="/admin/review"
                      className={({ isActive }) =>
                        `relative py-5 px-1 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                          isActive
                            ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                            : "text-slate-600 hover:text-slate-900"
                        }`
                      }
                    >
                      <CheckSquare className="w-4 h-4" />
                      Review Candidates
                    </NavLink>
                    <NavLink
                      to="/admin/jobs/create"
                      className={({ isActive }) =>
                        `relative py-5 px-1 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                          isActive
                            ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                            : "text-slate-600 hover:text-slate-900"
                        }`
                      }
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create Job
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/jobs"
                      className={({ isActive }) =>
                        `relative py-5 px-2 text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                            : "text-slate-600 hover:text-slate-900"
                        }`
                      }
                    >
                      Jobs
                    </NavLink>
                    <span className="py-5 px-2 text-sm font-medium text-slate-400 cursor-default">
                      Applications
                    </span>
                    <span className="py-5 px-2 text-sm font-medium text-slate-400 cursor-default">
                      Resources
                    </span>
                    <span className="py-5 px-2 text-sm font-medium text-slate-400 cursor-default">
                      Profile
                    </span>
                  </>
                )
              ) : (
                <>
                  <a
                    href="#how-it-works"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1 nav-link-aura"
                  >
                    How It Works
                  </a>
                  <a
                    href="#features"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1 nav-link-aura"
                  >
                    AI Features
                  </a>
                  <a
                    href="#workflow"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1 nav-link-aura"
                  >
                    Hiring Pipeline
                  </a>
                </>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    {user?.name || (role === "admin" ? "Recruiter" : "Candidate")}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {role === "admin" ? "Admin Access" : "Candidate"}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors nav-link-aura"
                >
                  Sign In
                </Link>
                <MagneticButton
                  to="/register"
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition-colors btn-aura-primary"
                >
                  Get Started
                </MagneticButton>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-xl mb-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {role === "admin" ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="/admin/review"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Review Candidates
                  </Link>
                  <Link
                    to="/admin/jobs/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Create Job
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Available Jobs
                  </Link>
                </>
              )}
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
