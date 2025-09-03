import { Button } from "@/components/ui/button";
import Loader from "./Loader";

export default function TaskForm({ form, setForm, addTask, adding }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end w-full mb-6 flex-wrap">
      <input
        type="text"
        placeholder="Subject / Topic"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="p-2 sm:p-3 border w-full rounded-lg flex-1 dark:bg-gray-700 dark:text-white"
      />
      <input
        type="text"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="p-2 sm:p-3 border rounded-lg flex-1 w-full dark:bg-gray-700 dark:text-white"
      />
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
        className="p-2 sm:p-3 border rounded-lg w-full sm:w-auto dark:bg-gray-700 dark:text-white"
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="p-2 sm:p-3 border rounded-lg w-full sm:w-auto dark:bg-gray-700 dark:text-white"
      />
      <Button
        onClick={addTask}
        className="h-10 sm:h-12 flex items-center gap-2 w-full sm:w-auto"
        disabled={adding}
      >
        {adding ? <Loader size={16} /> : "Add Task"}
      </Button>
    </div>
  );
}
