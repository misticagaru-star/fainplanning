import React, { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import './TaskManager.css';

const { electron } = window;

function TaskManager({ tasks, workers, departments, onTaskChange }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workerId: '',
    departmentId: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    status: 'pending',
    hoursPerDay: 8,
    color: '#10B981'
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await electron.db.updateTask(editingId, formData);
      } else {
        await electron.db.addTask(formData);
      }
      setFormData({
        title: '',
        description: '',
        workerId: '',
        departmentId: '',
        startDate: '',
        endDate: '',
        priority: 'medium',
        status: 'pending',
        hoursPerDay: 8,
        color: '#10B981'
      });
      setEditingId(null);
      setShowForm(false);
      onTaskChange();
    } catch (error) {
      alert('Error al guardar tarea: ' + error.message);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      workerId: task.workerId,
      departmentId: task.departmentId,
      startDate: task.startDate.split('T')[0],
      endDate: task.endDate.split('T')[0],
      priority: task.priority,
      status: task.status,
      hoursPerDay: task.hoursPerDay,
      color: task.color
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await electron.db.deleteTask(id);
        onTaskChange();
      } catch (error) {
        alert('Error al eliminar tarea');
      }
    }
  };

  const getWorkerName = (workerId) => {
    const worker = workers.find(w => w.id === workerId);
    return worker ? worker.name : 'N/A';
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'N/A';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#FCD34D',
      in_progress: '#60A5FA',
      completed: '#34D399',
      cancelled: '#EF4444'
    };
    return statusColors[status] || '#999';
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      low: '#86EFAC',
      medium: '#FBBF24',
      high: '#F87171'
    };
    return priorityColors[priority] || '#999';
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Gestión de Tareas</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      {showForm && (
        <form className="manager-form task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Operario:</label>
            <select
              required
              value={formData.workerId}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
            >
              <option value="">Selecciona un operario</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Departamento:</label>
            <select
              required
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Fecha Fin:</label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Prioridad:</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <div className="form-group">
            <label>Horas por día:</label>
            <input
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={formData.hoursPerDay}
              onChange={(e) => setFormData({ ...formData, hoursPerDay: parseFloat(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Color:</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
          <div className="form-buttons form-buttons-full">
            <button type="submit" className="btn-success">Guardar</button>
            <button type="button" className="btn-cancel" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                workerId: '',
                departmentId: '',
                startDate: '',
                endDate: '',
                priority: 'medium',
                status: 'pending',
                hoursPerDay: 8,
                color: '#10B981'
              });
            }}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Operario</th>
              <th>Departamento</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{getWorkerName(task.workerId)}</td>
                <td>{getDepartmentName(task.departmentId)}</td>
                <td>{new Date(task.startDate).toLocaleDateString('es-ES')}</td>
                <td>{new Date(task.endDate).toLocaleDateString('es-ES')}</td>
                <td>
                  <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" onClick={() => handleEdit(task)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(task.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskManager;
