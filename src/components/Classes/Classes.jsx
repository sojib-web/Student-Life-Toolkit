import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEdit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { MdOutlineDoNotDisturb } from "react-icons/md";
import axiosInstance from "@/utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../StudyPlanner/Header";
import { useAuth } from "@/context/AuthContext";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const classTypes = [
  { label: "Lecture", color: "#3B82F6" },
  { label: "Exam", color: "#EF4444" },
  { label: "Assignment", color: "#10B981" },
];
const ITEMS_PER_PAGE = 3;

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    day: "Mon",
    startTime: "09:00",
    endTime: "10:00",
    type: "Lecture",
    color: "#3B82F6",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const paginatedClasses = classes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filterClasses = (cls) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      cls.name.toLowerCase().includes(query) ||
      cls.instructor.toLowerCase().includes(query) ||
      cls.day.toLowerCase().includes(query);
    const matchesType = typeFilter ? cls.type === typeFilter : true;
    return matchesSearch && matchesType;
  };

  const filteredClasses = paginatedClasses.filter(filterClasses);

  const highlightText = (text) => {
    const query = searchQuery;
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-300 dark:bg-yellow-500 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      const selectedType = classTypes.find((t) => t.label === value);
      setFormData((prev) => ({
        ...prev,
        type: value,
        color: selectedType.color,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const hasConflict = () => {
    return classes.some(
      (cls) =>
        cls.day === formData.day &&
        !(
          formData.endTime <= cls.startTime || formData.startTime >= cls.endTime
        ) &&
        cls._id !== editingId
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasConflict()) {
      toast.error("⚠️ Class time overlaps with another class!");
      return;
    }
    try {
      if (isEditing) {
        await axiosInstance.put(`/api/classes/${editingId}`, formData);
        setIsEditing(false);
        setEditingId(null);
        toast.success("✅ Class updated successfully!");
      } else {
        await axiosInstance.post("/api/classes", formData);
        toast.success("✅ Class added successfully!");
      }
      setFormData({
        name: "",
        instructor: "",
        day: "Mon",
        startTime: "09:00",
        endTime: "10:00",
        type: "Lecture",
        color: "#3B82F6",
      });
      fetchClasses();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save class!");
    }
  };

  const handleEdit = (cls) => {
    setFormData({ ...cls });
    setIsEditing(true);
    setEditingId(cls._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/classes/${id}`);
      fetchClasses();
      toast.success("🗑️ Class deleted!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete class!");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedClasses.length) {
      toast.error("⚠️ Please select classes first!");
      return;
    }
    try {
      await axiosInstance.post("/api/classes/bulk-delete", {
        ids: selectedClasses,
      });
      setSelectedClasses([]);
      setSelectAll(false);
      fetchClasses();
      toast.success("🗑️ Selected classes deleted!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Bulk delete failed!");
    }
  };

  const handleExport = () => {
    if (!selectedClasses.length) {
      toast.error("⚠️ Select classes to export!");
      return;
    }
    const data = classes.filter((cls) => selectedClasses.includes(cls._id));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "classes-export.json";
    link.click();
    toast.success("📂 Classes exported successfully!");
  };

  const toggleSelectClass = (id) => {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedClasses([]);
      setSelectAll(false);
    } else {
      const ids = filteredClasses.map((cls) => cls._id);
      setSelectedClasses(ids);
      setSelectAll(true);
    }
  };

  const calculateDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const minutes = (eh - sh) * 60 + (em - sm);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const totalPages = Math.ceil(classes.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full p-4 sm:p-6 space-y-8">
      <Header
        className="mb-4"
        title={`Good Day, ${user?.displayName || "Student"}!`}
        subtitle="Here’s a clear view of your class schedule and tasks for today."
      />

      {/* Form Card */}
      <Card className="p-4 sm:p-6 shadow-xl border rounded-2xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-gray-100">
          {isEditing ? "Edit Class" : "Add New Class"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
        >
          <div>
            <Label>Class Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <Label>Instructor</Label>
            <Input
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <Label>Day</Label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <Label>Class Type</Label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            >
              {classTypes.map((t) => (
                <option key={t.label} value={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              {isEditing ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Class List Card */}
      <Card className="p-2 sm:p-4 shadow-xl border rounded-2xl bg-white dark:bg-gray-900 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0 sm:space-x-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Classes
          </h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button
              onClick={handleBulkDelete}
              className="bg-gray-900 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 w-full sm:w-auto"
            >
              Delete Selected
            </Button>
            <Button
              onClick={handleExport}
              className="bg-gray-900 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 w-full sm:w-auto"
            >
              Export Selected
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <Input
            type="text"
            placeholder="Search by name, instructor, day..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-1/4 border p-2 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">All Types</option>
            {classTypes.map((t) => (
              <option key={t.label} value={t.label}>
                {t.label}
              </option>
            ))}
          </select>
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="w-4 h-4"
            />
            <span className="text-gray-900 dark:text-gray-100">Select All</span>
          </label>
        </div>

        {filteredClasses.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300 flex items-center space-x-2">
            <MdOutlineDoNotDisturb /> <span>Class not found.</span>
          </p>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {filteredClasses.map((cls) => (
              <li
                key={cls._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-700"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto flex-wrap">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls._id)}
                    onChange={() => toggleSelectClass(cls._id)}
                    className="w-4 h-4"
                  />
                  <div className="text-gray-900 dark:text-gray-100 break-words">
                    <p>{highlightText(cls.name)}</p>
                    <p>
                      {highlightText(
                        `${cls.instructor} | ${cls.day} | ${cls.startTime}-${
                          cls.endTime
                        } (${calculateDuration(
                          cls.startTime,
                          cls.endTime
                        )}) | ${cls.type}`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 sm:space-x-3 items-center mt-2 sm:mt-0">
                  <div
                    className="w-5 h-5 rounded-full border"
                    style={{ backgroundColor: cls.color }}
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleEdit(cls)} size="icon">
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => handleDelete(cls._id)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {filteredClasses.length > 0 && (
          <div className="flex flex-wrap justify-center mt-3 sm:mt-4 gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-gray-900 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`${
                  currentPage === i + 1
                    ? "bg-gray-900 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                    : ""
                }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-gray-900 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        }
      />
    </div>
  );
}
