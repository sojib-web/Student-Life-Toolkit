import { Button } from "@/components/ui/button";
import { AiFillCheckCircle } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import { RiDeleteBack2Fill } from "react-icons/ri";

const priorityColors = {
  High: "bg-red-600",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

export default function TaskCard({
  task,
  dayStr,
  toggleComplete,
  sendNotification,
  deleteTask,
}) {
  return (
    <div
      className={`p-2 rounded-lg mb-2 shadow flex justify-between items-start gap-2 ${
        task.completed
          ? "opacity-70 line-through bg-gray-100 dark:bg-gray-700"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="flex flex-col min-w-0 flex-1">
        <p className="font-semibold text-sm truncate">{task.subject}</p>
        <button
          className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
            priorityColors[task.priority]
          } text-white`}
        >
          {task.priority}
        </button>
        {task.notes && (
          <p className="text-xs text-gray-500 line-clamp-2">{task.notes}</p>
        )}
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <Button size="icon" onClick={() => toggleComplete(dayStr, task.id)}>
          <AiFillCheckCircle size={16} />
        </Button>
        <Button size="icon" onClick={() => sendNotification(dayStr, task.id)}>
          <HiOutlineMail size={16} />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => deleteTask(dayStr, task.id)}
        >
          <RiDeleteBack2Fill size={16} />
        </Button>
      </div>
    </div>
  );
}
