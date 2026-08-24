{/*import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold">✅ TaskFlow</h1>
            <div className="flex items-center gap-4">
                
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{user?.name}</span>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;*/}

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-4 md:px-6 py-4 flex justify-between items-center shadow-lg">
            {/* Logo */}
            <Link to="/dashboard" className="text-lg md:text-xl font-bold">
                ✅ TaskFlow
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">

                {/* Dark mode toggle */}
                {/*<button
                    onClick={toggleDarkMode}
                    className="text-white hover:text-yellow-300 transition text-xl"
                    title="Toggle dark mode"
                >
                    {darkMode ? "🌞" : "🌙"}
                </button>*/}

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-lg transition"
                    >
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                        <span className="text-xs">▼</span>
                    </button>

                    {/* Dropdown menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50">
                            <Link
                                to="/profile"
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition text-sm"
                            >
                                👤 Profile
                            </Link>
                            <hr className="my-1" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition w-full text-left text-sm"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;