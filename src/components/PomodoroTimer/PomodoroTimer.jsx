import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

// Default: 25m focus / 5m break
const DEFAULT_FOCUS = 25 * 60;
const DEFAULT_BREAK = 5 * 60;

export default function PomodoroTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    Number(localStorage.getItem("sl_focus_secs")) || DEFAULT_FOCUS
  );
  const [focusSecs, setFocusSecs] = useState(DEFAULT_FOCUS);
  const [breakSecs, setBreakSecs] = useState(DEFAULT_BREAK);
  const intervalRef = useRef(null);

  // save in localStorage
  useEffect(() => {
    localStorage.setItem("sl_focus_secs", timeLeft);
  }, [timeLeft]);

  // timer logic
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((s) => {
        if (s > 0) return s - 1;
        const nextIsBreak = !isBreak;
        const next = nextIsBreak ? breakSecs : focusSecs;
        setIsBreak(nextIsBreak);
        notify(nextIsBreak ? "Break time! 🧘" : "Focus time! 📚");
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak, focusSecs, breakSecs]);

  const notify = (msg) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") new Notification(msg);
      else if (Notification.permission !== "denied")
        Notification.requestPermission();
    }
  };

  const format = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(focusSecs);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-xl hover:scale-105 transition transform">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">
        Pomodoro Timer ⏳
      </h3>

      {/* Quick Presets */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[15, 25, 45].map((m) => (
          <button
            key={m}
            onClick={() => {
              setFocusSecs(m * 60);
              if (!isBreak) setTimeLeft(m * 60);
            }}
            className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-medium"
          >
            {m}m
          </button>
        ))}
        {[3, 5, 10].map((m) => (
          <button
            key={`b${m}`}
            onClick={() => {
              setBreakSecs(m * 60);
              if (isBreak) setTimeLeft(m * 60);
            }}
            className="px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition text-sm font-medium"
          >
            Break {m}m
          </button>
        ))}
      </div>

      {/* Session Indicator */}
      <p
        className={`text-center mb-2 font-semibold ${
          isBreak ? "text-green-700" : "text-blue-700"
        }`}
      >
        {isBreak ? "🧘 Short Break" : "📚 Focus Session"}
      </p>

      {/* Timer Display */}
      <p className="text-center text-5xl font-bold mb-6 font-mono text-gray-800 dark:text-gray-100">
        {format(timeLeft)}
      </p>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsRunning((v) => !v)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition transform active:scale-95"
          aria-label={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
        <button
          onClick={reset}
          className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition transform active:scale-95"
          aria-label="Reset"
        >
          <FaRedo size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-3 rounded-full ${
            isBreak ? "bg-green-500" : "bg-blue-500"
          } transition-all duration-500`}
          style={{
            width: `${
              (((isBreak ? breakSecs : focusSecs) - timeLeft) /
                (isBreak ? breakSecs : focusSecs)) *
              100
            }%`,
          }}
        />
      </div>
    </Card>
  );
}
