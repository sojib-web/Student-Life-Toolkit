import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../StudyPlanner/Header";
import FiltersAndGenerate from "./FiltersAndGenerate";
import AddEditQuestionForm from "./AddEditQuestionForm";
import CustomQuestionsList from "./CustomQuestionsList";

import AIQuestionForm from "@/pages/AIQuestionForm";

export default function ExamQAGenerator() {
  const [customQuestions, setCustomQuestions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [current, setCurrent] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newQ, setNewQ] = useState({
    type: "MCQ",
    difficulty: "Easy",
    question: "",
    options: ["", ""],
    answer: "",
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const QUESTIONS_PER_PAGE = 3;

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosInstance.get("/questions");
        setCustomQuestions(
          Array.isArray(data)
            ? data.map((q) => ({ ...q, _id: q._id || `temp-${Date.now()}` }))
            : []
        );
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load questions.");
      }
    };
    fetchQuestions();
  }, []);

  const filteredBank = () =>
    customQuestions.filter(
      (q) =>
        (filterType === "All" || q.type === filterType) &&
        (filterDifficulty === "All" || q.difficulty === filterDifficulty) &&
        (!search || q.question.toLowerCase().includes(search.toLowerCase()))
    );

  const pickRandomQuestion = () => {
    const pool = filteredBank();
    if (!pool.length) {
      setCurrent(null);
      setFeedback(null);
      setShowAnswer(false);
      return;
    }
    const idx = Math.floor(Math.random() * pool.length);
    const q = pool[idx];
    if (q.type === "MCQ")
      q.options = [...(q.options || [])].sort(() => Math.random() - 0.5);
    setCurrent(q);
    setUserAnswer("");
    setFeedback(null);
    setShowAnswer(false);
  };

  const saveAttempt = async () => {
    if (!current) return;
    try {
      await axiosInstance.post("/api/attempts", {
        questionId: current._id,
        userAnswer,
        isCorrect: userAnswer === current.answer,
      });
      console.log("Attempt saved to database");
    } catch (err) {
      console.error("Failed to save attempt:", err);
    }
  };

  const checkAnswer = () => {
    if (!current) return;

    let correct = false;

    if (current.type === "MCQ" || current.type === "TrueFalse") {
      correct = userAnswer === current.answer;
    } else if (current.type === "Short") {
      correct =
        (userAnswer || "").trim().toLowerCase() ===
        (current.answer || "").trim().toLowerCase();
    }

    setFeedback(correct ? "Correct!" : "Incorrect");
    setShowAnswer(true);

    // Database এ save
    saveAttempt();
  };

  // Handle add/edit question
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentData = editingQuestion || newQ;
    const payload = {
      type: currentData.type,
      difficulty: currentData.difficulty,
      question: currentData.question.trim(),
      options:
        currentData.type === "MCQ"
          ? currentData.options.map((o) => o.trim()).filter(Boolean)
          : [],
      answer: currentData.answer.trim(),
    };

    // Validation
    if (!payload.question) return setFormError("Question is required");
    if (!payload.answer) return setFormError("Answer is required");
    if (payload.type === "MCQ" && payload.options.length < 2)
      return setFormError("MCQ needs at least 2 options");

    try {
      setSaving(true);
      let res;

      if (editingQuestion?._id && !editingQuestion._id.startsWith("temp-")) {
        // Edit existing question
        res = await axiosInstance.put(
          `/questions/${editingQuestion._id}`,
          payload
        );
        const updatedQuestion = {
          ...res.data.data,
          _id: res.data.data._id.toString(),
        };
        setCustomQuestions((prev) =>
          prev.map((q) => (q._id === editingQuestion._id ? updatedQuestion : q))
        );
        setEditingQuestion(null);
        toast.success("Question updated!");
      } else {
        // Add new question
        res = await axiosInstance.post("/questions", payload);
        setCustomQuestions((prev) => [
          ...prev,
          { ...res.data.data, _id: res.data.data._id.toString() },
        ]);
        setNewQ({
          type: "MCQ",
          difficulty: "Easy",
          question: "",
          options: ["", ""],
          answer: "",
        });
        toast.success("Question added!");
      }
      setFormError("");
    } catch (err) {
      console.error("Submit error:", err);
      setFormError(err.response?.data?.message || "Something went wrong");
      toast.error(formError || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axiosInstance.delete(`/questions/${id}`);
      setCustomQuestions((prev) => prev.filter((q) => q._id !== id));
      toast.success("Question deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete question.");
    }
  };

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        title="Exam Q&A Generator"
        subtitle="Test your knowledge, practice questions, and track your progress all in one place!"
      />
      <AIQuestionForm />
      <div className="grid lg:grid-cols-2 gap-6 mb-8 mt-10">
        <FiltersAndGenerate
          filterType={filterType}
          setFilterType={setFilterType}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          onGenerate={pickRandomQuestion}
          current={current}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          feedback={feedback}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          onCheck={checkAnswer}
        />
        <AddEditQuestionForm
          newQ={newQ}
          setNewQ={setNewQ}
          editingQuestion={editingQuestion}
          setEditingQuestion={setEditingQuestion}
          formError={formError}
          saving={saving}
          submitHandler={handleSubmit}
        />
      </div>

      <CustomQuestionsList
        questions={customQuestions}
        deleteQuestion={deleteQuestion}
        setEditingQuestion={setEditingQuestion}
      />

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
