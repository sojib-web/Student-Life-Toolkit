import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Download, Mail } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { addDays, startOfMonth, endOfMonth, format } from "date-fns";
import axiosInstance from "@/utils/axiosInstance";

// Priority colors
const priorityColors = {
  High: "bg-red-600",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

// Generate calendar days
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
  const DAYS_PER_PAGE = 8;
  const totalPages = Math.ceil(calendarDays.length / DAYS_PER_PAGE);
  const paginatedDays = calendarDays.slice(
    currentPage * DAYS_PER_PAGE,
    currentPage * DAYS_PER_PAGE + DAYS_PER_PAGE
  );

  // Load tasks
  const loadTasks = async () => {
    try {
      const res = await axiosInstance.get("/planner");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add Task
  const addTask = async () => {
    if (!form.subject || !form.date) return;
    try {
      const res = await axiosInstance.post("/planner", {
        ...form,
        notified: false, // <-- Add notified field
      });
      const newTask = res.data;
      setTasks((prev) => ({
        ...prev,
        [form.date]: prev[form.date]
          ? [...prev[form.date], newTask]
          : [newTask],
      }));
      setForm({
        subject: "",
        priority: "Medium",
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Complete
  const toggleComplete = async (date, id) => {
    const task = tasks[date].find((t) => t.id === id);
    try {
      await axiosInstance.put(`/planner/${date}/${id}`, {
        completed: !task.completed,
      });
      setTasks((prev) => ({
        ...prev,
        [date]: prev[date].map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (date, id) => {
    try {
      await axiosInstance.delete(`/planner/${date}/${id}`);
      setTasks((prev) => ({
        ...prev,
        [date]: prev[date].filter((t) => t.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and Drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceTasks = Array.from(tasks[source.droppableId] || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const destTasks = Array.from(tasks[destination.droppableId] || []);
    destTasks.splice(destination.index, 0, movedTask);
    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    });
    try {
      await axiosInstance.put(
        `/planner/${destination.droppableId}/${movedTask.id}`,
        { date: destination.droppableId }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Export Tasks
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
    } catch (err) {
      console.error(err);
    }
  };

  // Import Tasks
  const importTasks = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        await axiosInstance.post("/planner/import", json);
        setTasks(json);
      } catch {
        alert("Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  // Calculate Completion %
  const calculateCompletion = (date) => {
    const dayTasks = tasks[date] || [];
    if (!dayTasks.length) return 0;
    return Math.round(
      (dayTasks.filter((t) => t.completed).length / dayTasks.length) * 100
    );
  };

  // Send Notification
  const sendNotification = async (date, taskId) => {
    const task = tasks[date].find((t) => t.id === taskId);
    if (!task || task.notified) return; // Already notified

    try {
      // Mock API for sending email
      await axiosInstance.post(`/planner/notify/${taskId}`, {
        subject: task.subject,
        date,
      });

      // Update notified in frontend
      setTasks((prev) => ({
        ...prev,
        [date]: prev[date].map((t) =>
          t.id === taskId ? { ...t, notified: true } : t
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen dark:bg-gray-900 space-y-6">
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Monthly Study Planner
      </h2>

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-end mb-4 w-full">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-3 border rounded-lg shadow-sm w-full sm:w-auto dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Priorities</option>
          {Object.keys(priorityColors).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg shadow-sm flex-1 min-w-[150px] dark:bg-gray-700 dark:text-white"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={exportTasks}
            className="flex items-center h-12 gap-1 whitespace-nowrap"
          >
            <Download size={16} /> Export
          </Button>
          <label className="flex items-center justify-center h-12 px-4 gap-1 bg-gray-900 text-white rounded-lg cursor-pointer dark:bg-white dark:text-black hover:bg-gray-700 transition">
            <Upload size={16} /> Import
            <input
              type="file"
              accept=".json"
              onChange={importTasks}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Bottom Row: Add Task Form */}
      <div className="flex flex-col sm:flex-row gap-3 items-end w-full mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Subject / Topic"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="p-3 border rounded-lg shadow-sm flex-1 min-w-[150px] dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="p-3 border rounded-lg shadow-sm flex-1 min-w-[150px] dark:bg-gray-700 dark:text-white"
        />
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="p-3 border rounded-lg shadow-sm w-full sm:w-auto dark:bg-gray-700 dark:text-white"
        >
          {Object.keys(priorityColors).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="p-3 border rounded-lg shadow-sm w-full sm:w-auto dark:bg-gray-700 dark:text-white"
        />
        <Button onClick={addTask} className="h-12">
          Add Task
        </Button>
      </div>

      {/* Calendar */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedDays.map((day) => {
            const dayStr = format(day, "yyyy-MM-dd");
            const dayTasks = tasks[dayStr] || [];
            return (
              <Droppable droppableId={dayStr} key={dayStr}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 rounded-xl min-h-[200px] border shadow-sm ${
                      snapshot.isDraggingOver
                        ? "bg-blue-50 dark:bg-blue-900"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {format(day, "dd MMM")}
                      </h3>
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div
                          className="h-2 rounded-full bg-green-400"
                          style={{ width: `${calculateCompletion(dayStr)}%` }}
                        />
                      </div>
                    </div>
                    {dayTasks
                      .filter((t) =>
                        filterPriority ? t.priority === filterPriority : true
                      )
                      .filter((t) =>
                        t.subject.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 rounded-lg mb-2 shadow flex justify-between items-center ${
                                task.completed
                                  ? "opacity-70 line-through bg-gray-100 dark:bg-gray-700"
                                  : "bg-white dark:bg-gray-900"
                              } hover:shadow-md`}
                            >
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {task.subject}
                                </p>
                                <p
                                  className={`inline-block px-2 py-0.5 mt-1 text-sm rounded-full ${
                                    priorityColors[task.priority]
                                  } text-white`}
                                >
                                  {task.priority}
                                </p>
                                {task.notes && (
                                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                                    {task.notes}
                                  </p>
                                )}
                                {task.notified && (
                                  <p className="text-xs text-blue-500 mt-1">
                                    Notified 📧
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  onClick={() =>
                                    toggleComplete(dayStr, task.id)
                                  }
                                >
                                  ✅
                                </Button>
                                <Button
                                  size="icon"
                                  onClick={() =>
                                    sendNotification(dayStr, task.id)
                                  }
                                >
                                  📧
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => deleteTask(dayStr, task.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span className="text-gray-800 dark:text-gray-100">
          Page {currentPage + 1} / {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((p) => (p + 1 < totalPages ? p + 1 : p))
          }
          disabled={currentPage + 1 >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
