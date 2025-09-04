import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../StudyPlanner/Header";
import FiltersAndGenerate from "./FiltersAndGenerate";
import AddEditQuestionForm from "./AddEditQuestionForm";
import CustomQuestionsList from "./CustomQuestionsList";
import TopControls from "../StudyPlanner/TopControls";

export default function ExamQAGenerator() {
  const sampleQuestions = [
    {
      id: "s1",
      type: "MCQ",
      difficulty: "Easy",
      question: "React কোন ভাষায় তৈরি?",
      options: ["Python", "JavaScript", "PHP", "C++"],
      answer: "JavaScript",
    },
    {
      id: "s2",
      type: "TrueFalse",
      difficulty: "Easy",
      question: "HTML একটি প্রোগ্রামিং ভাষা।",
      answer: "False",
    },
    {
      id: "s3",
      type: "Short",
      difficulty: "Medium",
      question: "State এবং Props মধ্যে মূলত পার্থক্য কি?",
      answer:
        "State কম্পোনেন্ট-লোকাল ডেটা, props প্যারেন্ট থেকে পাস করা ইনপুট।",
    },
  ];

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
  const [filterPriority, setFilterPriority] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 3;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosInstance.get("/questions");
        setCustomQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load questions.");
      }
    };
    fetchQuestions();
  }, []);

  const combinedBank = [...sampleQuestions, ...customQuestions];
  const filteredBank = () =>
    combinedBank.filter(
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

  const checkAnswer = () => {
    if (!current) return;
    let correct = false;
    if (current.type === "MCQ" || current.type === "TrueFalse")
      correct = userAnswer === current.answer;
    else if (current.type === "Short")
      correct =
        (userAnswer || "").trim().toLowerCase() ===
        (current.answer || "").trim().toLowerCase();

    setFeedback(correct ? "Correct!" : "Incorrect");
    setShowAnswer(true);
    toast[correct ? "success" : "error"](correct ? "Correct!" : "Incorrect!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentData = editingQuestion || newQ;

    const payload = {
      type: currentData.type,
      difficulty: currentData.difficulty,
      question: (currentData.question || "").trim(),
      options: (currentData.options || []).map((o) => o.trim()).filter(Boolean),
      answer: (currentData.answer || "").trim(),
    };

    if (!payload.question) return setFormError("Question is required");
    if (!payload.answer) return setFormError("Answer is required");
    if (payload.type === "MCQ" && payload.options.length < 2)
      return setFormError("MCQ needs at least 2 options");

    if (editingQuestion?._id)
      submitNewQuestion(payload, true, editingQuestion._id);
    else submitNewQuestion(payload, false);
  };

  const submitNewQuestion = async (payload, isEditing = false, id = null) => {
    try {
      setSaving(true);
      let res;

      if (isEditing && id) {
        console.log("PUT URL:", `/questions/${id}`, "Payload:", payload);
        res = await axiosInstance.put(`/questions/${id}`, payload);

        setCustomQuestions((prev) =>
          prev.map((q) => (q._id === id ? res.data : q))
        );

        setEditingQuestion(null);
        toast.success("Question updated!");
      } else {
        res = await axiosInstance.post("/questions", payload);
        setCustomQuestions((prev) => [...prev, res.data]);

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
      console.error("Submit question error:", err);
      setFormError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axiosInstance.delete(`/questions/${id}`);
      setCustomQuestions((prev) => prev.filter((q) => q._id !== id));
      toast.success("Question deleted!");
    } catch {
      toast.error("Failed to delete question.");
    }
  };

  const exportQuestions = () => {
    const dataStr = JSON.stringify(customQuestions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-questions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importQuestions = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setCustomQuestions(imported);
          toast.success("Questions imported successfully!");
          setCurrentPage(1);
        } else {
          toast.error("Invalid file format");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to import questions");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        title="Exam Q&A Generator"
        subtitle="Test your knowledge, practice questions, and track your progress all in one place!"
      />

      <TopControls
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        search={search}
        setSearch={setSearch}
        exportTasks={exportQuestions}
        importTasks={importQuestions}
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        deleteQuestion={deleteQuestion}
        setEditingQuestion={setEditingQuestion}
        QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
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
