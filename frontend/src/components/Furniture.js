import React, { useState, useEffect } from 'react';
import { furnitureAPI, suppliersAPI } from '../services/api';

function Furniture() {
  const [furniture, setFurniture] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFurniture, setEditingFurniture] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    quantity: '',
    supplier_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [furnitureRes, suppliersRes] = await Promise.all([
        furnitureAPI.getAll(),
        suppliersAPI.getAll()
      ]);
      setFurniture(furnitureRes.data);
      setSuppliers(suppliersRes.data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        supplier_id: formData.supplier_id || null
      };

      if (editingFurniture) {
        await furnitureAPI.update(editingFurniture.id, data);
        setSuccess('Мебель обновлена успешно');
      } else {
        await furnitureAPI.create(data);
        setSuccess('Мебель добавлена успешно');
      }
      
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сохранения мебели');
    }
  };

  const handleEdit = (item) => {
    setEditingFurniture(item);
    setFormData({
      name: item.name,
      type: item.type,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      supplier_id: item.supplier_id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту мебель?')) {
      try {
        await furnitureAPI.delete(id);
        setSuccess('Мебель удалена успешно');
        loadData();
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка удаления мебели');
      }
    }
  };

  const handleQuantityUpdate = async (id, newQuantity) => {
    try {
      await furnitureAPI.updateQuantity(id, parseInt(newQuantity));
      setSuccess('Количество обновлено успешно');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка обновления количества');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', type: '', price: '', quantity: '', supplier_id: '' });
    setEditingFurniture(null);
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
    return <div className="loading">Загрузка мебели...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Мебель</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отмена' : 'Добавить мебель'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingFurniture ? 'Редактировать мебель' : 'Добавить мебель'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
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
                <label>Тип *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Выберите тип</option>
                  <option value="Стул">Стул</option>
                  <option value="Стол">Стол</option>
                  <option value="Шкаф">Шкаф</option>
                  <option value="Диван">Диван</option>
                  <option value="Кровать">Кровать</option>
                  <option value="Комод">Комод</option>
                  <option value="Полка">Полка</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Цена *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Количество *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Поставщик</label>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Выберите поставщика</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="btn-group">
              <button type="submit" className="btn btn-success">
                {editingFurniture ? 'Обновить' : 'Создать'}
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
              <th>Тип</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Поставщик</th>
              <th>Общая стоимость</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {furniture.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">Мебель не найдена</td>
              </tr>
            ) : (
              furniture.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.type}</td>
                  <td>{item.price.toLocaleString('ru-RU')} ₽</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityUpdate(item.id, e.target.value)}
                      style={{ width: '80px', padding: '0.25rem', border: '1px solid #ddd', borderRadius: '3px' }}
                      min="0"
                    />
                  </td>
                  <td>{item.supplier_name || '-'}</td>
                  <td><strong>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</strong></td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(item)}
                      >
                        Редактировать
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.id)}
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

      {furniture.length > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Итого</h3>
          <p>
            <strong>Общая стоимость всех товаров: </strong>
            {furniture.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('ru-RU')} ₽
          </p>
          <p>
            <strong>Общее количество товаров: </strong>
            {furniture.reduce((sum, item) => sum + item.quantity, 0)} шт.
          </p>
        </div>
      )}
    </div>
  );
}

export default Furniture; 