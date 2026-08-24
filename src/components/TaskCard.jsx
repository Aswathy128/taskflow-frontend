function TaskCard({ task, onToggle, onEdit, onDelete }) {

    const priorityColors = {
        High: "bg-red-100 text-red-600",
        Medium: "bg-yellow-100 text-yellow-600",
        Low: "bg-green-100 text-green-600"
    };

    {/*const isOverdue = task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status === "Pending";*/}

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Get due date at midnight
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    if (dueDate) dueDate.setHours(0, 0, 0, 0);
    // Overdue = due date is BEFORE today (not equal!)
    const isOverdue = dueDate && 
    dueDate < today && 
    task.status === "Pending";

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${
            task.status === "Completed"
                ? "border-green-500"
                : isOverdue
                ? "border-red-500"
                : "border-blue-500"
        }`}>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

                {/* Left side */}
                <div className="flex-1">

                    {/* Title */}
                    <p className={`font-semibold text-lg ${
                        task.status === "Completed"
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                    }`}>
                        {task.title}
                    </p>

                    {/* Description */}
                    {task.description && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                            {task.description}
                        </p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
                            {task.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            task.status === "Completed"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                        }`}>
                            {task.status}
                        </span>

                        {/* Created date */}
                        <span className="text-xs px-2 py-1 text-gray-600 bg-gray-100 rounded-full">
                            🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>

                        {/* Due date */}
                        {task.dueDate && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                isOverdue
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}>
                                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue && " ⚠️ Overdue"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right side — action buttons */}
                <div className="flex sm:flex-col gap-2">
                    <button
                        onClick={() => onToggle(task._id)}
                        className={`text-xs px-3 py-1 rounded-lg transition font-medium flex-1 sm:flex-none ${
                            task.status === "Completed"
                                ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                    >
                        {task.status === "Completed" ? "↩ Undo" : "✓ Done"}
                    </button>
                    <button
                        onClick={() => onEdit(task)}
                        className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition font-medium flex-1 sm:flex-none"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition font-medium flex-1 sm:flex-none"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;