import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { eachDayOfInterval, format, differenceInDays, startOfDay } from 'date-fns';
import './TaskBlock.css';

const API_URL = 'http://localhost:5000/api';

function TaskBlock({ task, startDate, dates, onDragStart }) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState(null);
  const blockRef = useRef(null);

  // Calculate position and width
  const taskStart = new Date(task.startDate);
  const taskEnd = new Date(task.endDate);
  
  const startIndex = dates.findIndex(d => startOfDay(d).getTime() === startOfDay(taskStart).getTime());
  const endIndex = dates.findIndex(d => startOfDay(d).getTime() === startOfDay(taskEnd).getTime());
  const duration = Math.max(endIndex - startIndex + 1, 1);

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !resizeStart) return;

      const delta = Math.round((e.clientX - resizeStart) / 50);
      const newEndDate = new Date(taskEnd);
      newEndDate.setDate(newEndDate.getDate() + delta);

      if (newEndDate > taskStart) {
        updateTask(newEndDate);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeStart(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart]);

  const updateTask = async (newEndDate) => {
    try {
      await axios.patch(`${API_URL}/tasks/${task._id}`, {
        endDate: newEndDate.toISOString()
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (startIndex < 0 || endIndex < 0) return null;

  return (
    <div
      ref={blockRef}
      className="task-block"
      style={{
        left: `${startIndex * 50}px`,
        width: `${duration * 50}px`,
        backgroundColor: task.color,
      }}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      title={task.title}
    >
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        <div className="task-dates">
          {format(taskStart, 'dd/MM')} - {format(taskEnd, 'dd/MM')}
        </div>
      </div>
      <div
        className="task-resize-handle"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}

export default TaskBlock;
