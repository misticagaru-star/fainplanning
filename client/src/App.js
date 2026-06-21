import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GanttChart from './components/GanttChart';
import DepartmentManager from './components/DepartmentManager';
import WorkerManager from './components/WorkerManager';
import TaskManager from './components/TaskManager';
import HolidayManager from './components/HolidayManager';
import Navigation from './components/Navigation';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('gantt');
  const [departments, setDepartments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [depRes, workRes, taskRes, holRes] = await Promise.all([
        axios.get(`${API_URL}/departments`),
        axios.get(`${API_URL}/workers`),
        axios.get(`${API_URL}/tasks`),
        axios.get(`${API_URL}/holidays`)
      ]);
      setDepartments(depRes.data);
      setWorkers(workRes.data);
      setTasks(taskRes.data);
      setHolidays(holRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = async () => {
    try {
      const res = await axios.get(`${API_URL}/departments`);
      setDepartments(res.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleWorkerChange = async () => {
    try {
      const res = await axios.get(`${API_URL}/workers`);
      setWorkers(res.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const handleTaskChange = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleHolidayChange = async () => {
    try {
      const res = await axios.get(`${API_URL}/holidays`);
      setHolidays(res.data);
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
