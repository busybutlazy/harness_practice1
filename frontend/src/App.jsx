import { useEffect, useMemo, useState } from "react";
import { addTask, getTasks, pinTask, toggleTask } from "./api";

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return String(a.id).localeCompare(String(b.id), undefined, {
      numeric: true,
    });
  });
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const data = await getTasks();
        if (!active) {
          return;
        }
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load tasks");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const sortedTasks = useMemo(() => sortTasks(tasks), [tasks]);

  async function handleAddTask(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || saving) {
      return;
    }

    setSaving(true);
    setError("");
    try {
      const created = await addTask(trimmed);
      setTasks((current) => sortTasks([...current, created]));
      setTitle("");
    } catch (err) {
      setError(err.message || "Failed to add task");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleTask(id) {
    try {
      const updated = await toggleTask(id);
      setTasks((current) =>
        current.map((task) => (task.id === id ? updated : task)),
      );
    } catch (err) {
      setError(err.message || "Failed to toggle task");
    }
  }

  async function handlePinTask(id) {
    try {
      const updated = await pinTask(id);
      setTasks((current) =>
        sortTasks(current.map((task) => (task.id === id ? updated : task))),
      );
    } catch (err) {
      setError(err.message || "Failed to pin task");
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Todo Demo</p>
        <h1>Tasks</h1>
        <p className="intro">A minimal list backed by a FastAPI API.</p>

        <form className="form" onSubmit={handleAddTask}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a task"
            aria-label="Task title"
          />
          <button type="submit" disabled={saving}>
            Add
          </button>
        </form>

        {error ? <p className="message error">{error}</p> : null}
        {loading ? <p className="message">Loading tasks...</p> : null}

        {!loading && sortedTasks.length === 0 ? (
          <p className="message">No tasks yet.</p>
        ) : null}

        <ul className="task-list">
          {sortedTasks.map((task) => (
            <li key={task.id} className={task.pinned ? "task pinned" : "task"}>
              <button
                className="checkbox"
                type="button"
                onClick={() => handleToggleTask(task.id)}
                aria-label={`Mark ${task.title} as ${task.completed ? "not completed" : "completed"}`}
              >
                {task.completed ? "✓" : ""}
              </button>

              <div className="task-content">
                <span className={task.completed ? "title done" : "title"}>
                  {task.title}
                </span>
                <span className="meta">
                  {task.completed ? "Completed" : "Active"}
                  {task.pinned ? " • Pinned" : ""}
                </span>
              </div>

              <button
                className="pin-button"
                type="button"
                onClick={() => handlePinTask(task.id)}
              >
                {task.pinned ? "Unpin" : "Pin"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
