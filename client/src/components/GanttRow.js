import React, { useState, useRef } from 'react';
import axios from 'axios';
import TaskBlock from './TaskBlock';
import './GanttRow.css';
import { eachDayOfInterval, format, startOfDay } from 'date-fns';

const API_URL = 'http://localhost:5000/api';

function GanttRow({ worker, tasks, startDate, numDays, holidays, dates, onTaskChange }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const rowRef = useRef(null);

  const handleCellClick = (index) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectionStart(index);
    }
  };

  const handleCellMouseEnter = (index) => {
    if (isSelecting && selectionStart !== null) {
      // Visual feedback for selection
    }
  };

  const handleCellMouseUp = async (index) => {
    if (isSelecting && selectionStart !== null) {
      const start = Math.min(selectionStart, index);
      const end = Math.max(selectionStart, index);
      
      const startDate = dates[start];
      const endDate = dates[end];

      // Create new task
      const taskTitle = prompt('Nombre de la tarea:');
      if (taskTitle) {
        try {
          await axios.post(`${API_URL}/tasks`, {
            title: taskTitle,
            description: '',
            worker: worker._id,
            department: worker.department._id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            priority: 'medium',
            hoursPerDay: worker.maxHoursPerDay,
            color: '#10B981'
          });
          onTaskChange();
        } catch (error) {
          console.error('Error creating task:', error);
        }
      }
      
      setIsSelecting(false);
      setSelectionStart(null);
    }
  };

  const handleTaskDragStart = (e, task) => {
    setDraggedTask(task);
    setDragStart(e.clientX);
  };

  const handleTaskDrop = async (e, index) => {
    e.preventDefault();
    if (!draggedTask) return;

    const delta = Math.round((e.clientX - dragStart) / 50); // 50px per day
    const newStartDate = new Date(draggedTask.startDate);
    newStartDate.setDate(newStartDate.getDate() + delta);
    
    const newEndDate = new Date(draggedTask.endDate);
    newEndDate.setDate(newEndDate.getDate() + delta);

    try {
      await axios.patch(`${API_URL}/tasks/${draggedTask._id}`, {
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString(),
        worker: draggedTask.worker._id
      });
      onTaskChange();
    } catch (error) {
      console.error('Error updating task:', error);
    }

    setDraggedTask(null);
    setDragStart(null);
  };

  return (
    <div className="gantt-row" ref={rowRef}>
      <div className="gantt-row-worker">
        <div className="worker-name">{worker.name}</div>
        <div className="worker-department">{worker.department.name}</div>
      </div>
      <div 
        className="gantt-row-cells"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleTaskDrop}
      >
        {dates.map((date, index) => {
          const isHoliday = holidays.some(h => 
            startOfDay(new Date(h.date)).getTime() === startOfDay(date).getTime()
          );
          
          return (
            <div
              key={index}
              className={`gantt-cell ${isHoliday ? 'holiday' : ''}`}
              onClick={() => handleCellClick(index)}
              onMouseEnter={() => handleCellMouseEnter(index)}
              onMouseUp={() => handleCellMouseUp(index)}
            />
          );
        })}
        
        {tasks.map((task) => (
          <TaskBlock
            key={task._id}
            task={task}
            startDate={startDate}
            dates={dates}
            onDragStart={handleTaskDragStart}
          />
        ))}
      </div>
    </div>
  );
}

export default GanttRow;
