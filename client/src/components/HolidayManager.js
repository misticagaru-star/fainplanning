import React, { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import './HolidayManager.css';

const { electron } = window;

function HolidayManager({ holidays, departments, onHolidayChange }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'company',
    departments: []
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await electron.db.updateHoliday(editingId, formData);
      } else {
        await electron.db.addHoliday(formData);
      }
      setFormData({ name: '', date: '', type: 'company', departments: [] });
      setEditingId(null);
      setShowForm(false);
      onHolidayChange();
    } catch (error) {
      alert('Error al guardar día festivo: ' + error.message);
    }
  };

  const handleEdit = (holiday) => {
    setFormData({
      name: holiday.name,
      date: holiday.date.split('T')[0],
      type: holiday.type,
      departments: holiday.departments || []
    });
    setEditingId(holiday.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este día festivo?')) {
      try {
        await electron.db.deleteHoliday(id);
        onHolidayChange();
      } catch (error) {
        alert('Error al eliminar día festivo');
      }
    }
  };

  const toggleDepartment = (deptId) => {
    if (formData.departments.includes(deptId)) {
      setFormData({
        ...formData,
        departments: formData.departments.filter(d => d !== deptId)
      });
    } else {
      setFormData({
        ...formData,
        departments: [...formData.departments, deptId]
      });
    }
  };

  const getDepartmentNames = (deptIds) => {
    return deptIds.map(id => {
      const dept = departments.find(d => d.id === id);
      return dept ? dept.name : 'N/A';
    }).join(', ');
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      national: 'Nacional',
      regional: 'Regional',
      company: 'Empresa'
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Gestión de Días Festivos</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nuevo Día Festivo
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
            <label>Fecha:</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Tipo:</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="national">Nacional</option>
              <option value="regional">Regional</option>
              <option value="company">Empresa</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Departamentos Afectados:</label>
            <div className="checkbox-group">
              {departments.map((dept) => (
                <label key={dept.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.departments.includes(dept.id)}
                    onChange={() => toggleDepartment(dept.id)}
                  />
                  {dept.name}
                </label>
              ))}
            </div>
          </div>
          <div className="form-buttons form-buttons-full">
            <button type="submit" className="btn-success">Guardar</button>
            <button type="button" className="btn-cancel" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({ name: '', date: '', type: 'company', departments: [] });
            }}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Departamentos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday) => (
              <tr key={holiday.id}>
                <td>{holiday.name}</td>
                <td>{new Date(holiday.date).toLocaleDateString('es-ES')}</td>
                <td>{getTypeLabel(holiday.type)}</td>
                <td>{getDepartmentNames(holiday.departments || [])}</td>
                <td>
                  <button className="btn-icon" onClick={() => handleEdit(holiday)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(holiday.id)}>
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

export default HolidayManager;
