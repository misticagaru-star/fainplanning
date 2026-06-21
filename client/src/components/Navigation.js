import React from 'react';
import { Calendar, Users, Briefcase, Clock, BarChart3 } from 'lucide-react';
import './Navigation.css';

function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'gantt', label: 'Diagrama Gantt', icon: BarChart3 },
    { id: 'departments', label: 'Departamentos', icon: Briefcase },
    { id: 'workers', label: 'Operarios', icon: Users },
    { id: 'tasks', label: 'Tareas', icon: Clock },
    { id: 'holidays', label: 'Días Festivos', icon: Calendar }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">📊 FainPlanning - Gestor de Tareas</h1>
        <div className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
