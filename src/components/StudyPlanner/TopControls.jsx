import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

export default function TopControls({
  filterPriority,
  setFilterPriority,
  search,
  setSearch,
  exportTasks,
  importTasks,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end mb-4 w-full flex-wrap">
      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
        className="p-2 sm:p-3 border rounded-lg w-full sm:w-auto dark:bg-gray-700 dark:text-white"
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 sm:p-3 border rounded-lg flex-1 w-full lg:min-w-[150px] dark:bg-gray-700 dark:text-white"
      />
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <Button
          onClick={exportTasks}
          className="flex items-center h-10 sm:h-12 gap-1 w-full sm:w-auto"
        >
          <Download size={16} /> Export
        </Button>
        <label className="flex items-center justify-center h-10 sm:h-12 px-4 gap-1 bg-gray-900 text-white rounded-lg cursor-pointer dark:bg-white dark:text-black hover:bg-gray-700 transition w-full sm:w-auto">
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
  );
}
