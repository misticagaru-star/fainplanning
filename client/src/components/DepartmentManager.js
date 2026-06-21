import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus } from 'lucide-react';
import './DepartmentManager.css';

const API_URL = 'http://localhost:5000/api';

function DepartmentManager({ departments, onDepartmentChange }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#3B82F6' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`${API_URL}/departments/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/departments`, formData);
      }
      setFormData({ name: '', description: '', color: '#3B82F6' });
      setEditingId(null);
      setShowForm(false);
      onDepartmentChange();
    } catch (error) {
      alert('Error al guardar departamento');
    }
  };

  const handleEdit = (dept) => {
    setFormData(dept);
    setEditingId(dept._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
      try {
        await axios.delete(`${API_URL}/departments/${id}`);
        onDepartmentChange();
      } catch (error) {
        alert('Error al eliminar departamento');
      }
    }
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Gestión de Departamentos</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nuevo Departamento
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
            <label>Descripción:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          <div className="form-buttons">
            <button type="submit" className="btn-success">Guardar</button>
            <button type="button" className="btn-cancel" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({ name: '', description: '', color: '#3B82F6' });
            }}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="items-grid">
        {departments.map((dept) => (
          <div key={dept._id} className="item-card">
            <div className="item-header">
              <div 
                className="color-badge" 
                style={{ backgroundColor: dept.color }}
              />
              <h3>{dept.name}</h3>
            </div>
            <p className="item-description">{dept.description}</p>
            <div className="item-actions">
              <button className="btn-icon" onClick={() => handleEdit(dept)}>
                <Edit2 size={18} />
              </button>
              <button className="btn-icon btn-danger" onClick={() => handleDelete(dept._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentManager;
