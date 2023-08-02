import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validTitle, setvalidTitle] = useState(true);
  const [validDescription, setvalidDescription] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/task/all");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (title.trim().length <= 0) {
      setvalidTitle(false);
      return;
    }
    if (description.trim().length <= 0) {
      setvalidDescription(false);
      return;
    }
    try {
      setvalidTitle(true);
      setvalidDescription(true);
      const response = await axios.post(
        "http://localhost:9000/api/task/create_task",
        {
          title,
          description,
          status: "Pending",
        }
      );
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:9000/api/task/updateTask/${id}`, {
        status,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/task/deleteTask/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="App">
      <h1>Task Management Application</h1>
      <div>
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${validTitle ? "" : "error"}`}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${validDescription ? "" : "error"}`}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <h2>Task List</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => updateTaskStatus(task._id, "Completed")}>
                Mark as Completed
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
