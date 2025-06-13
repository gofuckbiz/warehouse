import React, { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (err) {
      setError('Ошибка загрузки клиентов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, formData);
        setSuccess('Клиент обновлен успешно');
      } else {
        await clientsAPI.create(formData);
        setSuccess('Клиент создан успешно');
      }
      
      resetForm();
      loadClients();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сохранения клиента');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone || '',
      address: client.address || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      try {
        await clientsAPI.delete(id);
        setSuccess('Клиент удален успешно');
        loadClients();
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка удаления клиента');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '' });
    setEditingClient(null);
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
    return <div className="loading">Загрузка клиентов...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Клиенты</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отмена' : 'Добавить клиента'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingClient ? 'Редактировать клиента' : 'Добавить клиента'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя *</label>
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
              <label>Телефон</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-control"
                placeholder="+7 (999) 123-45-67"
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
                {editingClient ? 'Обновить' : 'Создать'}
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
              <th>Имя</th>
              <th>Телефон</th>
              <th>Адрес</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Клиенты не найдены</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td><strong>{client.name}</strong></td>
                  <td>{client.phone || '-'}</td>
                  <td>{client.address || '-'}</td>
                  <td>{new Date(client.created_at).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(client)}
                      >
                        Редактировать
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(client.id)}
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

export default Clients; 