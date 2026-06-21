import React, { useState } from 'react';
import GanttRow from './GanttRow';
import './GanttChart.css';
import { addDays, eachDayOfInterval } from 'date-fns';

function GanttChart({ workers, tasks, holidays, departments, onTaskChange }) {
  const [startDate, setStartDate] = useState(new Date(2024, 0, 1));
  const [numDays, setNumDays] = useState(30);
  const [selectedRange, setSelectedRange] = useState(null);

  const endDate = addDays(startDate, numDays);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateRangeChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

  const handleNumDaysChange = (e) => {
    setNumDays(parseInt(e.target.value));
  };

  return (
    <div className="gantt-container">
      <div className="gantt-controls">
        <div className="control-group">
          <label>Fecha Inicio:</label>
          <input 
            type="date" 
            value={startDate.toISOString().split('T')[0]}
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="control-group">
          <label>Número de días:</label>
          <input 
            type="number" 
            min="7" 
            max="365" 
            value={numDays}
            onChange={handleNumDaysChange}
          />
        </div>
      </div>

      <div className="gantt-chart">
        <div className="gantt-header">
          <div className="gantt-worker-names">Operarios</div>
          <div className="gantt-timeline">
            <div className="gantt-dates">
              {dates.map((date, idx) => (
                <div key={idx} className="gantt-date-cell">
                  <div className="gantt-day-name">
                    {date.toLocaleDateString('es-ES', { weekday: 'short' }).substring(0, 1)}
                  </div>
                  <div className="gantt-day-number">
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gantt-body">
          {workers.map((worker) => {
            const workerTasks = tasks.filter(task => task.worker._id === worker._id);
            return (
              <GanttRow
                key={worker._id}
                worker={worker}
                tasks={workerTasks}
                startDate={startDate}
                numDays={numDays}
                holidays={holidays}
                dates={dates}
                onTaskChange={onTaskChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GanttChart;
