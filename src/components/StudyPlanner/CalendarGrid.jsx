import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import ProgressBar from "./ProgressBar";

export default function CalendarGrid({
  paginatedDays,
  tasks,
  filterPriority,
  search,
  toggleComplete,
  sendNotification,
  deleteTask,
  onDragEnd,
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedDays.map((day) => {
          const dayStr = day.toISOString().slice(0, 10);
          const dayTasks = tasks[dayStr] || [];
          const total = dayTasks.length;
          const completed = dayTasks.filter((t) => t.completed).length;
          const pct = total ? Math.round((completed / total) * 100) : 0;

          return (
            <Droppable droppableId={dayStr} key={dayStr}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-3 rounded-xl min-h-[220px] border shadow-sm flex flex-col ${
                    snapshot.isDraggingOver
                      ? "bg-blue-50 dark:bg-blue-900"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {dayStr}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {completed}/{total} tasks
                      </p>
                    </div>
                    <ProgressBar
                      completion={pct}
                      totalTasks={total}
                      completedTasks={completed}
                    />
                  </div>
                  <div className="flex-1 overflow-auto max-h-[300px]">
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
                            >
                              <TaskCard
                                task={task}
                                dayStr={dayStr}
                                toggleComplete={toggleComplete}
                                sendNotification={sendNotification}
                                deleteTask={deleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {dayTasks.length === 0 && (
                      <div className="text-xs text-gray-400 mt-2">No tasks</div>
                    )}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
