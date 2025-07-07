// components/ui/Progress-tracker.tsx

"use client";

import { CheckCircle2, CircleDashed } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  label: string;
}

interface ProgressTrackerProps {
  initialTasks: Task[];
  completedTasks: Set<string>; // Receives completion state from parent
  isLatest: boolean;
}

export const ProgressTracker = ({
  initialTasks,
  completedTasks,
  isLatest,
}: ProgressTrackerProps) => {
  // Logic is now controlled by the parent. This component just renders.
  const progressPercentage = initialTasks.length > 0 ? (completedTasks.size / initialTasks.length) * 100 : 0;

  return (
    <div className="w-full space-y-4">
      {/* Progress Bar */}
      <div className="w-full bg-[#30363D] rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-700 ease-out rounded-full",
            isLatest
              ? "bg-gradient-to-r from-[#7b61ff] to-[#00ccb1]"
              : "bg-emerald-500"
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {initialTasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          return (
            <div
              key={task.id}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 transition-all duration-300" />
                ) : (
                  <CircleDashed className="h-4 w-4 text-gray-500 animate-spin [animation-duration:3s]" />
                )}
              </div>
              <span className={cn(
                "text-sm transition-all duration-300",
                isCompleted
                  ? "text-gray-500 line-through"
                  : "text-gray-200"
              )}>
                {task.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};