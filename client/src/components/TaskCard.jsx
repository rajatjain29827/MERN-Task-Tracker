export default function TaskCard({ task, onEdit, onDelete, onStatusToggle }) {
  const statusCycle = { pending: "in-progress", "in-progress": "completed", completed: "pending" };

  return (
    <div className={`task-card ${task.status === "completed" ? "completed" : ""}`}>
      <div className="task-card-body">
        <h3 className={task.status === "completed" ? "completed-text" : ""}>
          {task.title}
        </h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className={`badge ${task.status}`}>{task.status}</span>
          <span className={`badge ${task.priority}`}>{task.priority}</span>
        </div>
      </div>
      <div className="task-card-actions">
        <button className="btn-status" onClick={() => onStatusToggle(task._id, statusCycle[task.status])}>
          {statusCycle[task.status]}
        </button>
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
