import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Profile() {
    const { user, login } = useAuth();
    const [nameForm, setNameForm] = useState({ name: user?.name || "" });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [nameSuccess, setNameSuccess] = useState("");
    const [nameError, setNameError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameLoading, setNameLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    // Add state
    const [profileStats, setProfileStats] = useState(null);

    // Add useEffect
    useEffect(() => {
    const fetchProfileStats = async () => {
        try {
            const { data } = await API.get("/tasks/stats");
            setProfileStats(data);
        } catch (error) {
            console.log(error);
        }
    };
    fetchProfileStats();
}, []);

    // Update name
    const handleUpdateName = async (e) => {
        e.preventDefault();
        setNameError("");
        setNameSuccess("");
        setNameLoading(true);

        try {
            const { data } = await API.put("/auth/update-profile", {
                name: nameForm.name
            });
            login(data.user, localStorage.getItem("token"));
            setNameSuccess("Name updated successfully!");
        } catch (error) {
            setNameError(error.response?.data?.message || "Something went wrong!");
        } finally {
            setNameLoading(false);
        }
    };

    // Change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return setPasswordError("Passwords don't match!");
        }

        if (passwordForm.newPassword.length < 6) {
            return setPasswordError("Password must be at least 6 characters!");
        }

        setPasswordLoading(true);

        try {
            await API.put("/auth/change-password", {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordSuccess("Password changed successfully!");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            setPasswordError(error.response?.data?.message || "Something went wrong!");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 ">
            <Navbar/>

            <div className="max-w-2xl mx-auto p-4 md:p-6">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        My Profile
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Manage your account settings
                    </p>
                </div>

                {/* Profile card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {user?.name}
                            </h3>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    {profileStats && (
                        <div className="grid grid-cols-3 gap-4 mb-6 mt-6 pt-6 border-t">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {profileStats.total}
                                </p>
                                <p className="text-xs text-gray-500">Total Tasks</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-500">
                                    {profileStats.completed}
                                </p>
                                <p className="text-xs text-gray-500">Completed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-500">
                                    {profileStats.pending}
                                </p>
                                <p className="text-xs text-gray-500">Pending</p>
                            </div>
                        </div>
                    )}

                    {/* Update name form */}
                    <form onSubmit={handleUpdateName}>
                        <h4 className="font-semibold text-gray-700 mb-3">
                            Update Name
                        </h4>

                        {nameSuccess && (
                            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-3 text-sm">
                                {nameSuccess}
                            </div>
                        )}
                        {nameError && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-3 text-sm">
                                {nameError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={nameForm.name}
                                onChange={(e) => setNameForm({ name: e.target.value })}
                                placeholder="Enter new name"
                                required
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={nameLoading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {nameLoading ? "Saving..." : "Update"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change password card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h4 className="font-semibold text-gray-700  mb-4">
                        Change Password
                    </h4>

                    {passwordSuccess && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-3 text-sm">
                            {passwordSuccess}
                        </div>
                    )}
                    {passwordError && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-3 text-sm">
                            {passwordError}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value
                            })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value
                            })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value
                            })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                        >
                            {passwordLoading ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Profile;