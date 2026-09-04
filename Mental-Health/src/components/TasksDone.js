import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "../css/TasksDone.css";
import Nav from "./Nav.js";
import Footer from "./Footer.js";
import { useNavigate } from "react-router-dom";

const defaultInitialTasks = [
  { id: "local-1", text: "Practice 5 minutes of mindful box-breathing", completed: true },
  { id: "local-2", text: "Take a quiet walk without phone notifications", completed: false },
  { id: "local-3", text: "Drink a glass of water and stretch gently", completed: false }
];

const TaskDone = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(auth.currentUser?.uid || "guest");
  const navigate = useNavigate();

  const getStorageKey = (uid) => `sahaya_tasks_${uid || "guest"}`;

  // Fetch tasks for the authenticated user
  const fetchTasks = async (uid) => {
    const activeUid = uid || auth.currentUser?.uid || "guest";
    const storageKey = getStorageKey(activeUid);

    try {
      const userTasksCollection = collection(db, "Users", activeUid, "tasks");
      const querySnapshot = await getDocs(userTasksCollection);
      if (!querySnapshot.empty) {
        const tasksData = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setTasks(tasksData);
        localStorage.setItem(storageKey, JSON.stringify(tasksData));
      } else {
        const cached = localStorage.getItem(storageKey);
        setTasks(cached ? JSON.parse(cached) : defaultInitialTasks);
      }
    } catch (error) {
      console.warn("Using local tasks cache for user:", error.message);
      const cached = localStorage.getItem(storageKey);
      setTasks(cached ? JSON.parse(cached) : defaultInitialTasks);
    } finally {
      setLoading(false);
    }
  };

  // Add task
  const addTask = async (e) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;

    const activeUid = userId || auth.currentUser?.uid || "guest";
    const storageKey = getStorageKey(activeUid);

    const taskObj = {
      text: newTask.trim(),
      completed: false,
      timestamp: new Date(),
      userId: activeUid,
    };

    try {
      const userTasksCollection = collection(db, "Users", activeUid, "tasks");
      const docRef = await addDoc(userTasksCollection, taskObj);
      const updated = [...tasks, { id: docRef.id, ...taskObj }];
      setTasks(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      const localId = Date.now().toString();
      const updated = [...tasks, { id: localId, ...taskObj }];
      setTasks(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    setNewTask("");
  };

  // Delete task
  const deleteTask = async (id) => {
    const activeUid = userId || auth.currentUser?.uid || "guest";
    const storageKey = getStorageKey(activeUid);

    try {
      const taskDoc = doc(db, "Users", activeUid, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.warn("Local task deletion fallback");
    }
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Toggle completion
  const toggleCompletion = async (id) => {
    const activeUid = userId || auth.currentUser?.uid || "guest";
    const storageKey = getStorageKey(activeUid);

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const taskDoc = doc(db, "Users", activeUid, "tasks", id);
      await updateDoc(taskDoc, { completed: !task.completed });
    } catch (error) {
      console.warn("Local toggle fallback");
    }

    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const uid = user ? user.uid : "guest";
      setUserId(uid);
      fetchTasks(uid);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Nav />
      <div className="tasks-page-wrapper">
        <div className="tasks-container">
          <div className="tasks-card">
            <h1 className="tasks-title">Daily Mindful Steps</h1>
            <p className="tasks-subtitle">
              Celebrate your journey one small victory at a time. No stress, just gentle progress.
            </p>

            <form onSubmit={addTask} className="task-input-container">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="task-input"
                placeholder="Add a gentle habit or goal (e.g. 10m sunshine, read 5 pages)..."
              />
              <button type="submit" className="add-task-button">
                + Add Step
              </button>
            </form>

            {loading ? (
              <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>Loading your goals...</p>
            ) : tasks.length === 0 ? (
              <div className="tasks-empty-state">
                <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "8px" }}>🌱</span>
                <p>All steps completed! Take a moment to relax and enjoy the calm.</p>
              </div>
            ) : (
              <ul className="tasks-list">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`task-item ${task.completed ? "completed" : ""}`}
                  >
                    <div
                      className="task-content-left"
                      onClick={() => toggleCompletion(task.id)}
                    >
                      <div className="task-checkbox">
                        {task.completed && "✓"}
                      </div>
                      <span className="task-text">{task.text}</span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-task-button"
                      title="Remove task"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <Footer />
    </>
  );
};

export default TaskDone;
