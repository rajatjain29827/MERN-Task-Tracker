import { useState, useEffect } from "react";

const INITIAL = { title: "", description: "", status: "pending", priority: "medium" };

export default function TaskForm({ editTask, onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description || "",
        status: editTask.status,
        priority: editTask.priority,
      });
    } else {
      setForm(INITIAL);
    }
  }, [editTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "title") setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    onSubmit(form);
    if (!editTask) setForm(INITIAL);
  };

  return (
    <div className="task-form">
      <h2>{editTask ? "Edit Task" : "Add New Task"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            name="title"
            placeholder="Task title *"
            value={form.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
          />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">{editTask ? "Update" : "Add"}</button>
          {editTask && (
            <button type="button" className="cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
