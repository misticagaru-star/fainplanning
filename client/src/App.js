import React, { useState, useEffect } from 'react';
import GanttChart from './components/GanttChart';
import DepartmentManager from './components/DepartmentManager';
import WorkerManager from './components/WorkerManager';
import TaskManager from './components/TaskManager';
import HolidayManager from './components/HolidayManager';
import Navigation from './components/Navigation';
import './App.css';

const { electron } = window;

function App() {
  const [activeTab, setActiveTab] = useState('gantt');
  const [departments, setDepartments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [depRes, workRes, taskRes, holRes] = await Promise.all([
        electron.db.getDepartments(),
        electron.db.getWorkers(),
        electron.db.getTasks(),
        electron.db.getHolidays()
      ]);
      setDepartments(depRes || []);
      setWorkers(workRes || []);
      setTasks(taskRes || []);
      setHolidays(holRes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = async () => {
    try {
      const res = await electron.db.getDepartments();
      setDepartments(res || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleWorkerChange = async () => {
    try {
      const res = await electron.db.getWorkers();
      setWorkers(res || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const handleTaskChange = async () => {
    try {
      const res = await electron.db.getTasks();
      setTasks(res || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleHolidayChange = async () => {
    try {
      const res = await electron.db.getHolidays();
      setHolidays(res || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  return (
    <div className="app">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="app-content">
        {loading && <div className="loading">Cargando...</div>}
        
        {!loading && (
          <>
            {activeTab === 'gantt' && (
              <GanttChart 
                workers={workers} 
                tasks={tasks} 
                holidays={holidays}
                departments={departments}
                onTaskChange={handleTaskChange}
              />
            )}
            {activeTab === 'departments' && (
              <DepartmentManager 
                departments={departments}
                onDepartmentChange={handleDepartmentChange}
              />
            )}
            {activeTab === 'workers' && (
              <WorkerManager 
                workers={workers}
                departments={departments}
                onWorkerChange={handleWorkerChange}
              />
            )}
            {activeTab === 'tasks' && (
              <TaskManager 
                tasks={tasks}
                workers={workers}
                departments={departments}
                onTaskChange={handleTaskChange}
              />
            )}
            {activeTab === 'holidays' && (
              <HolidayManager 
                holidays={holidays}
                departments={departments}
                onHolidayChange={handleHolidayChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
