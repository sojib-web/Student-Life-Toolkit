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
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
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
      console.error("Fetch classes error:", err);
      toast.error("❌ Failed to fetch classes!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { _id, ...dataToSend } = formData;
        const res = await axiosInstance.put(
          `/api/classes/${editingId}`,
          dataToSend
        );
        setClasses((prev) =>
          prev.map((cls) =>
            cls._id === editingId ? { ...res.data, _id: editingId } : cls
          )
        );
        toast.success("✅ Class updated successfully!");
        setIsEditing(false);
        setEditingId(null);
      } else {
        const res = await axiosInstance.post("/api/classes", formData);
        setClasses((prev) => [...prev, res.data]);
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
    } catch (err) {
      console.error("❌ Save class error:", err.response?.data || err);
      toast.error(
        `❌ Failed to save class! ${err.response?.data?.message || err.message}`
      );
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
      setClasses((prev) => prev.filter((cls) => cls._id !== id));
      toast.success("🗑️ Class deleted!");
    } catch (err) {
      console.error("Delete class error:", err);
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
      setClasses((prev) =>
        prev.filter((cls) => !selectedClasses.includes(cls._id))
      );
      setSelectedClasses([]);
      setSelectAll(false);
      toast.success("🗑️ Selected classes deleted!");
    } catch (err) {
      console.error("Bulk delete error:", err);
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
      <Card className="p-4 sm:p-6 shadow-xl border rounded-2xl bg-white dark:bg-gray-900 overflow-x-auto">
        {/* Header + Bulk Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Your Classes
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-500 text-white w-full sm:w-auto"
            >
              Delete Selected
            </Button>
            <Button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-500 text-white w-full sm:w-auto"
            >
              Export Selected
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
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

        {/* Table Header (always visible) */}
        <div className="grid grid-cols-8 gap-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium p-2 rounded-t-lg">
          <span>Checkbox</span>
          <span>Class Name</span>
          <span>Instructor</span>
          <span>Day</span>
          <span>Start Time</span>
          <span>End Time</span>
          <span>Class Type</span>
          <span>Actions</span>
        </div>

        {/* Classes List */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredClasses.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300 flex items-center space-x-2 mt-3">
              <MdOutlineDoNotDisturb /> <span>Class not found.</span>
            </p>
          ) : (
            filteredClasses.map((cls) => (
              <li
                key={cls._id}
                className="grid grid-cols-1 sm:grid-cols-8 gap-4 items-start sm:items-center p-4 sm:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Checkbox */}
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls._id)}
                    onChange={() => toggleSelectClass(cls._id)}
                    className="w-4 h-4"
                  />
                </div>

                {/* Name */}
                <div className="col-span-1 font-medium text-gray-900 dark:text-gray-100">
                  {cls.name}
                </div>

                {/* Instructor */}
                <div className="col-span-1 text-gray-700 dark:text-gray-300">
                  {cls.instructor}
                </div>

                {/* Day */}
                <div className="col-span-1 text-gray-700 dark:text-gray-300">
                  {cls.day}
                </div>

                {/* Start Time */}
                <div className="col-span-1 text-gray-700 dark:text-gray-300">
                  {cls.startTime}
                </div>

                {/* End Time */}
                <div className="col-span-1 text-gray-700 dark:text-gray-300">
                  {cls.endTime}
                </div>

                {/* Type */}
                <div className="col-span-1 flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: cls.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {cls.type}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center gap-2">
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

                {/* Mobile stacked info */}
                <div className="sm:hidden mt-2 flex flex-col gap-1 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div>
                    <strong>Class Name:</strong> {cls.name}
                  </div>
                  <div>
                    <strong>Instructor:</strong> {cls.instructor}
                  </div>
                  <div>
                    <strong>Day:</strong> {cls.day}
                  </div>
                  <div>
                    <strong>Time:</strong> {cls.startTime} - {cls.endTime}
                  </div>
                  <div className="flex items-center">
                    <strong>Type:</strong>{" "}
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-1 ml-1"
                      style={{ backgroundColor: cls.color }}
                    ></span>
                    {cls.type}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Pagination */}
        {filteredClasses.length > 0 && (
          <div className="flex flex-wrap justify-center mt-4 gap-2">
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
