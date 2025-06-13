import React, { useState, useEffect } from 'react';
import { suppliersAPI } from '../services/api';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contacts: '',
    address: ''
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (err) {
      setError('Ошибка загрузки поставщиков');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersAPI.update(editingSupplier.id, formData);
        setSuccess('Поставщик обновлен успешно');
      } else {
        await suppliersAPI.create(formData);
        setSuccess('Поставщик создан успешно');
      }
      
      resetForm();
      loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сохранения поставщика');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contacts: supplier.contacts || '',
      address: supplier.address || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого поставщика?')) {
      try {
        await suppliersAPI.delete(id);
        setSuccess('Поставщик удален успешно');
        loadSuppliers();
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка удаления поставщика');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', contacts: '', address: '' });
    setEditingSupplier(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Загрузка поставщиков...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Поставщики</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отмена' : 'Добавить поставщика'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingSupplier ? 'Редактировать поставщика' : 'Добавить поставщика'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Контакты</label>
              <input
                type="text"
                name="contacts"
                value={formData.contacts}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Телефон, email"
              />
            </div>
            
            <div className="form-group">
              <label>Адрес</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
              />
            </div>
            
            <div className="btn-group">
              <button type="submit" className="btn btn-success">
                {editingSupplier ? 'Обновить' : 'Создать'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Контакты</th>
              <th>Адрес</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Поставщики не найдены</td>
              </tr>
            ) : (
              suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>{supplier.id}</td>
                  <td><strong>{supplier.name}</strong></td>
                  <td>{supplier.contacts || '-'}</td>
                  <td>{supplier.address || '-'}</td>
                  <td>{new Date(supplier.created_at).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(supplier)}
                      >
                        Редактировать
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(supplier.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suppliers; 