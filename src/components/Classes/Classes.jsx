import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosInstance from "@/utils/axiosInstance";

// Localizer
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ITEMS_PER_PAGE = 3;

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    day: "Mon",
    startTime: "09:00",
    endTime: "10:00",
    color: "#3B82F6",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const totalPages = Math.ceil(classes.length / ITEMS_PER_PAGE);
  const paginatedClasses = classes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`/api/classes/${editingId}`, formData);
        setIsEditing(false);
        setEditingId(null);
      } else {
        await axiosInstance.post("/api/classes", formData);
      }
      setFormData({
        name: "",
        instructor: "",
        day: "Mon",
        startTime: "09:00",
        endTime: "10:00",
        color: "#3B82F6",
      });
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cls) => {
    setFormData({
      name: cls.name,
      instructor: cls.instructor,
      day: cls.day,
      startTime: cls.startTime,
      endTime: cls.endTime,
      color: cls.color,
    });
    setIsEditing(true);
    setEditingId(cls._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full p-6 space-y-8">
      {/* Form Card */}
      <Card className="p-6 shadow-xl border rounded-2xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          {isEditing ? "Edit Class" : "Add New Class"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <Label className="text-gray-800 dark:text-gray-200">
              Class Name
            </Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <Label className="text-gray-800 dark:text-gray-200">
              Instructor
            </Label>
            <Input
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <Label className="text-gray-800 dark:text-gray-200">Day</Label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-gray-800 dark:text-gray-200">
              Start Time
            </Label>
            <Input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <Label className="text-gray-800 dark:text-gray-200">End Time</Label>
            <Input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <Label className="text-gray-800 dark:text-gray-200">Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: formData.color }}
              />
              <Input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-8 p-0 border-none"
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button type="submit">
              {isEditing ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Calendar Card */}
      <Card className="p-4 shadow-xl border rounded-2xl bg-white dark:bg-gray-900">
        <Calendar
          localizer={localizer}
          events={classes.map((cls) => ({
            ...cls,
            start: new Date(`1970-01-01T${cls.startTime}`),
            end: new Date(`1970-01-01T${cls.endTime}`),
            title: cls.name,
          }))}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day", "agenda"]}
          defaultView="week"
          style={{ height: 300 }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              color: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              padding: "3px 6px",
            },
          })}
        />
      </Card>

      {/* Class List with Pagination */}
      <Card className="p-4 shadow-xl border rounded-2xl bg-white dark:bg-gray-900">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Your Classes
        </h3>
        {classes.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            No classes added yet.
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {paginatedClasses.map((cls) => (
                <li
                  key={cls._id}
                  className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-700"
                >
                  <div className="text-gray-900 dark:text-gray-100">
                    <p>{cls.name}</p>
                    <p>
                      {cls.instructor} | {cls.day} | {cls.startTime} -{" "}
                      {cls.endTime}
                    </p>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: cls.color }}
                    />
                    <button onClick={() => handleEdit(cls)}>
                      <FaEdit className="text-gray-700 dark:text-gray-200" />
                    </button>
                    <button onClick={() => handleDelete(cls._id)}>
                      <FaTrash className="text-gray-700 dark:text-gray-200" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                  }
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
