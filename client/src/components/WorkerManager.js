import React, { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import './WorkerManager.css';

const { electron } = window;

function WorkerManager({ workers, departments, onWorkerChange }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    departmentId: '',
    position: '',
    maxHoursPerDay: 8
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await electron.db.updateWorker(editingId, formData);
      } else {
        await electron.db.addWorker(formData);
      }
      setFormData({ name: '', email: '', departmentId: '', position: '', maxHoursPerDay: 8 });
      setEditingId(null);
      setShowForm(false);
      onWorkerChange();
    } catch (error) {
      alert('Error al guardar operario: ' + error.message);
    }
  };

  const handleEdit = (worker) => {
    setFormData({
      name: worker.name,
      email: worker.email,
      departmentId: worker.departmentId,
      position: worker.position,
      maxHoursPerDay: worker.maxHoursPerDay
    });
    setEditingId(worker.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este operario?')) {
      try {
        await electron.db.deleteWorker(id);
        onWorkerChange();
      } catch (error) {
        alert('Error al eliminar operario');
      }
    }
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
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
              setFormData({ name: '', email: '', departmentId: '', position: '', maxHoursPerDay: 8 });
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
              <tr key={worker.id}>
                <td>{worker.name}</td>
                <td>{worker.email}</td>
                <td>{getDepartmentName(worker.departmentId)}</td>
                <td>{worker.position}</td>
                <td>{worker.maxHoursPerDay}h</td>
                <td>
                  <button className="btn-icon" onClick={() => handleEdit(worker)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(worker.id)}>
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
