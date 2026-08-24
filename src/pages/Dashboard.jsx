import { useState, useEffect, useRef  } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import FilterBar from "../components/FilterBar";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

function Dashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
        completionPercentage: 0
    });

    // Modal states
    const [showForm, setShowForm] = useState(false);
    const [editTask, setEditTask] = useState(null);

    // 1. State at top
    const [upcomingTasks, setUpcomingTasks] = useState([]);


     // Filter states
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        priority: "",
        category: "",
        sort: ""
    });

    // Debounce ref
    const searchTimeout = useRef(null);

    // Fetch tasks and stats
    useEffect(() => {
        fetchTasks();
        fetchStats();
        fetchUpcoming();
    }, []);

    /*const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/tasks");
            setTasks(data.tasks);
        } catch (error) {
            setError("Failed to fetch tasks!");
        } finally {
            setLoading(false);
        }
    };*/

    // Fetch tasks with filters
    const fetchTasks = async (currentFilters = filters) => {
    try {
        setLoading(true);

        // Build query string from filters
        const params = new URLSearchParams();
        if (currentFilters.search) params.append("search", currentFilters.search);
        if (currentFilters.status) params.append("status", currentFilters.status);
        if (currentFilters.priority) params.append("priority", currentFilters.priority);
        if (currentFilters.category) params.append("category", currentFilters.category);
        if (currentFilters.sort) params.append("sort", currentFilters.sort);

        const { data } = await API.get(`/tasks?${params.toString()}`);
        setTasks(data.tasks);
    } catch (error) {
        setError("Failed to fetch tasks!");
    } finally {
        setLoading(false);
    }
};

    //fetch states
    const fetchStats = async () => {
        try {
            const { data } = await API.get("/tasks/stats");
            setStats(data);
        } catch (error) {
            console.log("Stats error:", error);
        }
    };

    const fetchUpcoming = async () => {
    try {
        const { data } = await API.get("/tasks");
        console.log("All tasks:", data.tasks); // check this!
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(23, 59, 59, 999);

        console.log("Today:", today);
        console.log("Next week:", nextWeek);

        const upcoming = data.tasks.filter(task => {
            if (!task.dueDate || task.status === "Completed") return false;
            const due = new Date(task.dueDate);
            console.log("Task due:", task.title, due); // check each task!
            return due >= today && due <= nextWeek;
        });

        console.log("Upcoming:", upcoming);
        setUpcomingTasks(upcoming);
    } catch (error) {
        console.log(error);
    }
};


    // Handle individual filter change
    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);

        if (filterName === "search") {
            clearTimeout(searchTimeout.current);
            searchTimeout.current = setTimeout(() => {
                fetchTasks(newFilters);
            }, 500);
        } else {
            fetchTasks(newFilters);
        }
    };

    // Clear all filters
    const handleClearFilters = () => {
    const clearedFilters = {
        search: "",
        status: "",
        priority: "",
        category: "",
        sort: ""
    };
    setFilters(clearedFilters);
    fetchTasks(clearedFilters);
};

    // Add task
    const handleAddTask = async (formData) => {
        const { data } = await API.post("/tasks", formData);
        setTasks([data.task, ...tasks]);
        fetchStats();
    };

    // Edit task
    const handleEditTask = async (formData) => {
        const { data } = await API.put(`/tasks/${editTask._id}`, formData);
        setTasks(tasks.map(t => t._id === editTask._id ? data.task : t));
        setEditTask(null);
        fetchStats();
    };

    // Delete task
    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        await API.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(t => t._id !== taskId));
        fetchStats();
    };

    // Toggle status
    const handleToggle = async (taskId) => {
        const { data } = await API.patch(`/tasks/${taskId}/status`);
        setTasks(tasks.map(t => t._id === taskId ? data.task : t));
        fetchStats();
    };

    // Open edit form
    const openEditForm = (task) => {
        setEditTask(task);
        setShowForm(true);
    };

    // Close form
    const closeForm = () => {
        setShowForm(false);
        setEditTask(null);
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                {/* Welcome message */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.name}! 👋
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Here's your task overview
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-gray-500 text-sm mt-1">Total</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
                        <p className="text-gray-500 text-sm mt-1">Pending</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                        <p className="text-gray-500 text-sm mt-1">Completed</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                        <p className="text-3xl font-bold text-red-500">{stats.overdue}</p>
                        <p className="text-gray-500 text-sm mt-1">Overdue</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">Overall Progress</p>
                        <p className="text-sm font-bold text-blue-600">
                            {stats.completionPercentage}% Completed
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${stats.completionPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Upcoming tasks this week */}
                {upcomingTasks.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">
                            📅 Due This Week ({upcomingTasks.length})
                        </h3>
                        <div className="space-y-2">
                            {upcomingTasks.map(task => (
                                <div
                                key={task._id}
                                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-orange-500 mt-0.5">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    task.priority === "High"
                                    ? "bg-red-100 text-red-600"
                                    : task.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                    }`}>
                                        {task.priority}
                                </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick filter buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {["All", "Pending", "Completed"].map((status) => (
                        <button
                        key={status}
                        onClick={() => handleFilterChange("status",
                            status === "All" ? "" : status)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                (status === "All" && !filters.status) ||
                                filters.status === status
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                            >
                                {status === "All" && `📋 All (${stats.total})`}
                                {status === "Pending" && `⏳ Pending (${stats.pending})`}
                                {status === "Completed" && `✅ Completed (${stats.completed})`}
                        </button>
                    ))}
                </div>

                {/* Filter bar */}
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Add task button */}
                <div className="flex justify-between items-center mb-4">
                    {/*<h3 className="text-lg font-semibold text-gray-700">
                        Your Tasks ({tasks.length})
                    </h3>*/}
                    <h3 className="text-lg font-semibold text-gray-700">
                        {filters.search || filters.status || filters.priority || filters.category
                        ? `Showing ${tasks.length} of ${stats.total} tasks`
                        : `Your Tasks (${tasks.length})`}
                    </h3>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        + Add Task
                    </button>
                </div>


                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && tasks.length === 0 && (
                    <div className="bg-white p-12 rounded-xl shadow-sm text-center">
                        <p className="text-5xl mb-4">📝</p>
                        <p className="text-gray-500 text-lg">
                            No tasks yet!
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Click "+ Add Task" to get started!
                        </p>
                    </div>
                )}

                {/* Task list */}
                {!loading && !error && tasks.length > 0 && (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onToggle={handleToggle}
                                onEdit={openEditForm}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Task Form Modal */}
            {showForm && (
                <TaskForm
                    onSubmit={editTask ? handleEditTask : handleAddTask}
                    onClose={closeForm}
                    editTask={editTask}
                />
            )}

        </div>
    );
}

export default Dashboard;