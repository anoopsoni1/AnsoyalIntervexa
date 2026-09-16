import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Building2,
  LogOut,
  User,
  Shield,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar: React.FC<{ onSearchSubmit?: (q: string) => void }> = ({
  onSearchSubmit,
}) => {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: "1",
      title: "New verified talent matched",
      desc: "Anoop Soni (Full Stack Developer, Credibility 88) matched your criteria.",
      time: "12m ago",
      unread: true,
    },
    {
      id: "2",
      title: "Candidate accepted opportunity",
      desc: "Hemant Singh accepted your introduction message.",
      time: "2h ago",
      unread: true,
    },
    {
      id: "3",
      title: "New assessment completed",
      desc: "Priya Sharma scored 95/100 in Backend Systems Evaluation.",
      time: "5h ago",
      unread: true,
    },
    {
      id: "4",
      title: "Profile verified",
      desc: "Dev Bhraman completed GitHub OAuth audit & Live project verification.",
      time: "1d ago",
      unread: false,
    },
  ];

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchInput.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchInput.trim());
      } else {
        navigate(`/candidates?q=${encodeURIComponent(searchInput.trim())}`);
      }
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInputEl = document.getElementById("global-search-input");
        searchInputEl?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between">
      {/* Search Bar Shortcut */}
      <div className="flex items-center gap-3 w-full max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search candidates by skill, role, technology (e.g. React, Node.js)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKey}
            className="w-full pl-10 pr-12 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white/10 text-slate-400 border border-white/10 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Company Badge */}
        {company && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 glass-1 border-white/10 rounded-xl text-xs font-semibold text-slate-200">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{company.name}</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Verified
            </span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsDropdownOpen(false);
            }}
            className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-3 border-white/15 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Notifications</span>
                </div>
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[10px] font-mono text-cyan-400 hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate("/candidates");
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-white/10 text-center">
                <Link
                  to="/candidates"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-bold text-cyan-400 hover:underline block py-1"
                >
                  View All Activity & Talent Updates →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recruiter Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-cyan-500/20">
              {user?.name?.[0]?.toUpperCase() || "R"}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-200 line-clamp-1">
                {user?.name || "Recruiter"}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono font-medium">
                {user?.role || "RECRUITER"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 glass-3 border-white/15 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-white/10">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
              </div>

              <Link
                to="/company"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 transition-colors"
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Company & Team</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 transition-colors"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Account & Security</span>
              </Link>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                  navigate("/login");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-950/20 border-t border-white/10 mt-1 text-left transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
