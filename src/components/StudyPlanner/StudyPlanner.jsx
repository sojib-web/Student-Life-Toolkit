import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { addDays, startOfMonth, endOfMonth, format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./Header";
import Loader from "./Loader";
import ProgressBar from "./ProgressBar";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import TopControls from "./TopControls";
import CalendarGrid from "./CalendarGrid";

/* ----------------------------- Utilities ----------------------------- */
const priorityColors = {
  High: "bg-red-600",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};
const generateCalendar = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [];
  let curr = start;
  while (curr <= end) {
    days.push(curr);
    curr = addDays(curr, 1);
  }
  return days;
};

/* ----------------------------- Main Component ----------------------------- */
export default function MonthlyStudyPlanner() {
  const [tasks, setTasks] = useState({});
  const [form, setForm] = useState({
    subject: "",
    priority: "Medium",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [calendarDays] = useState(generateCalendar(new Date()));
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const DAYS_PER_PAGE = 8;
  const totalPages = Math.ceil(calendarDays.length / DAYS_PER_PAGE);
  const paginatedDays = calendarDays.slice(
    currentPage * DAYS_PER_PAGE,
    currentPage * DAYS_PER_PAGE + DAYS_PER_PAGE
  );

  /* -------------------- Load tasks -------------------- */
  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/planner");
      setTasks(res.data || {});
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTasks();
  }, []);

  const getDayStats = (dateStr) => {
    const dayTasks = tasks[dateStr] || [];
    const total = dayTasks.length;
    const completed = dayTasks.filter((t) => t.completed).length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  };

  /* -------------------- Add Task -------------------- */
  const addTask = async () => {
    if (!form.subject || !form.date) {
      toast.warn("Subject and Date required");
      return;
    }
    setAdding(true);
    const optimisticId = Date.now();
    const optimisticTask = {
      id: optimisticId,
      ...form,
      completed: false,
      notified: false,
    };
    setTasks((prev) => ({
      ...prev,
      [form.date]: prev[form.date]
        ? [...prev[form.date], optimisticTask]
        : [optimisticTask],
    }));
    setForm({
      subject: "",
      priority: "Medium",
      date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    });

    try {
      const res = await axiosInstance.post("/planner", optimisticTask);
      const saved = res.data;
      setTasks((prev) => {
        const dayList = prev[saved.date] || [];
        const replaced = dayList.map((t) =>
          t.id === optimisticId ? saved : t
        );
        const found = replaced.some((r) => r.id === saved.id);
        return {
          ...prev,
          [saved.date]: found ? replaced : [...replaced, saved],
        };
      });
      toast.success("Task added");
    } catch (err) {
      setTasks((prev) => ({
        ...prev,
        [form.date]: (prev[form.date] || []).filter(
          (t) => t.id !== optimisticId
        ),
      }));
      toast.error("Failed to add task");
    } finally {
      setAdding(false);
    }
  };

  /* -------------------- Toggle Complete -------------------- */
  const toggleComplete = async (date, id) => {
    const dayList = tasks[date] || [];
    const task = dayList.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) => ({
      ...prev,
      [date]: prev[date].map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
    try {
      await axiosInstance.put(`/planner/${date}/${id}`, {
        completed: !task.completed,
      });
    } catch {
      setTasks((prev) => ({
        ...prev,
        [date]: prev[date].map((t) =>
          t.id === id ? { ...t, completed: task.completed } : t
        ),
      }));
      toast.error("Failed to update");
    }
  };

  /* -------------------- Delete Task -------------------- */
  const deleteTask = async (date, id) => {
    const removed = (tasks[date] || []).find((t) => t.id === id);
    setTasks((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((t) => t.id !== id),
    }));
    try {
      await axiosInstance.delete(`/planner/${date}/${id}`);
      toast.success("Deleted");
    } catch {
      setTasks((prev) => ({
        ...prev,
        [date]: prev[date] ? [...prev[date], removed] : [removed],
      }));
      toast.error("Failed to delete");
    }
  };

  /* -------------------- Send Notification -------------------- */
  const sendNotification = async (date, taskId) => {
    const task = (tasks[date] || []).find((t) => t.id === taskId);
    if (!task || task.notified) return toast.info("Already notified");
    try {
      await axiosInstance.post(`/planner/notify/${taskId}`, {
        subject: task.subject,
        date,
      });
      setTasks((prev) => ({
        ...prev,
        [date]: prev[date].map((t) =>
          t.id === taskId ? { ...t, notified: true } : t
        ),
      }));
      toast.success("Email sent");
    } catch {
      toast.error("Notify failed");
    }
  };

  /* -------------------- Drag & Drop -------------------- */
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceTasks = Array.from(tasks[source.droppableId] || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const destTasks = Array.from(tasks[destination.droppableId] || []);
    destTasks.splice(destination.index, 0, movedTask);
    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    }));

    try {
      await axiosInstance.put(`/planner/move/${movedTask.id}`, {
        newDate: destination.droppableId,
      });
      toast.success("Moved successfully!");
    } catch {
      toast.error("Move failed");
      setTasks((prev) => ({ ...prev }));
    }
  };

  /* -------------------- Import / Export -------------------- */
  const exportTasks = async () => {
    try {
      const res = await axiosInstance.get("/planner/export", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasks.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  };

  const importTasks = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await axiosInstance.post("/planner/import", json);
      setTasks(json);
      toast.success("Imported");
    } catch {
      toast.error("Invalid JSON or import failed");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen dark:bg-gray-900 space-y-6">
      <Header
        title="Monthly Study Planner"
        subtitle={`Organize your tasks, track progress, and study smarter — all in one place!
Plan your month, set priorities, and never miss a task again.`}
      />

      <TopControls
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        search={search}
        setSearch={setSearch}
        priorityColors={priorityColors}
        exportTasks={exportTasks}
        importTasks={importTasks}
      />
      <TaskForm
        form={form}
        setForm={setForm}
        addTask={addTask}
        adding={adding}
        priorityColors={priorityColors}
      />
      {loading && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-3">
            <Loader /> <span>Loading tasks...</span>
          </div>
        </div>
      )}
      <CalendarGrid
        paginatedDays={paginatedDays}
        tasks={tasks}
        getDayStats={getDayStats}
        filterPriority={filterPriority}
        search={search}
        toggleComplete={toggleComplete}
        sendNotification={sendNotification}
        deleteTask={deleteTask}
        priorityColors={priorityColors}
        onDragEnd={onDragEnd}
      />
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded flex-1 sm:flex-none text-center"
        >
          Previous
        </button>

        <span className="text-gray-800 dark:text-gray-100 text-center flex-1">
          Page {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p) => (p + 1 < totalPages ? p + 1 : p))
          }
          disabled={currentPage + 1 >= totalPages}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded flex-1 sm:flex-none text-center"
        >
          Next
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
