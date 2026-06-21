import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus } from 'lucide-react';
import './WorkerManager.css';

const API_URL = 'http://localhost:5000/api';

function WorkerManager({ workers, departments, onWorkerChange }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    maxHoursPerDay: 8
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`${API_URL}/workers/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/workers`, formData);
      }
      setFormData({ name: '', email: '', department: '', position: '', maxHoursPerDay: 8 });
      setEditingId(null);
      setShowForm(false);
      onWorkerChange();
    } catch (error) {
      alert('Error al guardar operario');
    }
  };

  const handleEdit = (worker) => {
    setFormData({
      name: worker.name,
      email: worker.email,
      department: worker.department._id,
      position: worker.position,
      maxHoursPerDay: worker.maxHoursPerDay
    });
    setEditingId(worker._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este operario?')) {
      try {
        await axios.delete(`${API_URL}/workers/${id}`);
        onWorkerChange();
      } catch (error) {
        alert('Error al eliminar operario');
      }
    }
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d._id === deptId);
    return dept ? dept.name : 'N/A';
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Gestión de Operarios</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nuevo Operario
        </button>
      </div>

      {showForm && (
        <form className="manager-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Departamento:</label>
            <select
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Cargo:</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Horas máximas por día:</label>
            <input
              type="number"
              min="1"
              max="24"
              value={formData.maxHoursPerDay}
              onChange={(e) => setFormData({ ...formData, maxHoursPerDay: parseInt(e.target.value) })}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-success">Guardar</button>
            <button type="button" className="btn-cancel" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({ name: '', email: '', department: '', position: '', maxHoursPerDay: 8 });
            }}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Departamento</th>
              <th>Cargo</th>
              <th>Horas/Día</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker._id}>
                <td>{worker.name}</td>
                <td>{worker.email}</td>
                <td>{worker.department.name}</td>
                <td>{worker.position}</td>
                <td>{worker.maxHoursPerDay}h</td>
                <td>
                  <button className="btn-icon" onClick={() => handleEdit(worker)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(worker._id)}>
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

export default WorkerManager;
