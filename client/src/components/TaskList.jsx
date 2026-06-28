import { useState, useEffect } from "react";
import axios from "axios";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { useNotification } from "./Notification";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const notify = useNotification();

  const fetchTasks = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (sort === "newest") params.sort = "newest";
      if (sort === "oldest") params.sort = "oldest";
      if (sort === "priority") params.sort = "priority";
      const { data } = await axios.get(`${API}/tasks`, { params });
      setTasks(data);
    } catch {
      notify("Failed to load tasks", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter, sort]);

  const handleCreate = async (form) => {
    try {
      const { data } = await axios.post(`${API}/tasks`, form);
      setTasks((prev) => [data, ...prev]);
      notify("Task created");
    } catch {
      notify("Failed to create task", "error");
    }
  };

  const handleUpdate = async (form) => {
    try {
      const { data } = await axios.put(`${API}/tasks/${editTask._id}`, form);
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      setEditTask(null);
      notify("Task updated");
    } catch {
      notify("Failed to update task", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      notify("Task deleted");
    } catch {
      notify("Failed to delete task", "error");
    }
  };

  const handleStatusToggle = async (id, status) => {
    try {
      const { data } = await axios.put(`${API}/tasks/${id}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch {
      notify("Failed to update status", "error");
    }
  };

  return (
    <>
      <TaskForm
        editTask={editTask}
        onSubmit={editTask ? handleUpdate : handleCreate}
        onCancel={() => setEditTask(null)}
      />

      <div className="filters">
        <label>Filter:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label>Sort:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div className="task-grid">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks yet</h3>
            <p>Add your first task above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={setEditTask}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          ))
        )}
      </div>
    </>
  );
}
