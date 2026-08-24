function FilterBar({ filters, onFilterChange, onClearFilters }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">

            {/* Search bar */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="🔍 Search tasks by title..."
                    value={filters.search}
                    onChange={(e) => onFilterChange("search", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            {/* Filter dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

                {/* Status filter */}
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange("status", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="">All Status</option>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Completed">✅ Completed</option>
                </select>

                {/* Priority filter */}
                <select
                    value={filters.priority}
                    onChange={(e) => onFilterChange("priority", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="">All Priority</option>
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                </select>

                {/* Category filter */}
                <select
                    value={filters.category}
                    onChange={(e) => onFilterChange("category", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="">All Categories</option>
                    <option value="Study">📚 Study</option>
                    <option value="Personal">👤 Personal</option>
                    <option value="Health">💊 Health</option>
                    <option value="Career">💼 Career</option>
                    <option value="Work">💻 Work</option>
                    <option value="Other">📌 Other</option>
                </select>

                {/* Sort */}
                <select
                    value={filters.sort}
                    onChange={(e) => onFilterChange("sort", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="">Sort: Newest</option>
                    <option value="dueDate">Sort: Due Date</option>
                    <option value="priority">Sort: Priority</option>
                </select>

            </div>

            {/* Clear filters button */}
            {(filters.search || filters.status || filters.priority || filters.category || filters.sort) && (
                <button
                    onClick={onClearFilters}
                    className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                    ✕ Clear all filters
                </button>
            )}

        </div>
    );
}

export default FilterBar;