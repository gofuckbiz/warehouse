import React, { useState, useEffect } from 'react';
import { ordersAPI, clientsAPI, furnitureAPI } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    items: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, clientsRes, furnitureRes] = await Promise.all([
        ordersAPI.getAll(),
        clientsAPI.getAll(),
        furnitureAPI.getAll()
      ]);
      setOrders(ordersRes.data);
      setClients(clientsRes.data);
      setFurniture(furnitureRes.data);
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
      if (formData.items.length === 0) {
        setError('Добавьте хотя бы один товар в заказ');
        return;
      }

      await ordersAPI.create(formData);
      setSuccess('Заказ создан успешно');
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания заказа');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setSuccess('Статус заказа обновлен успешно');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка обновления статуса');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await ordersAPI.delete(id);
        setSuccess('Заказ удален успешно');
        loadData();
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка удаления заказа');
      }
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await ordersAPI.getById(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      setError('Ошибка загрузки деталей заказа');
    }
  };

  const addItemToOrder = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { furniture_id: '', quantity: 1, price: 0 }]
    });
  };

  const removeItemFromOrder = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateOrderItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'furniture_id') {
      const selectedFurniture = furniture.find(f => f.id === parseInt(value));
      if (selectedFurniture) {
        newItems[index].price = selectedFurniture.price;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: []
    });
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status status-pending';
      case 'completed': return 'status status-completed';
      case 'cancelled': return 'status status-cancelled';
      default: return 'status';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'В ожидании';
      case 'completed': return 'Выполнен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">Загрузка заказов...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Заказы</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отмена' : 'Создать заказ'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2>Создать заказ</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Клиент *</label>
                <select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Выберите клиента</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.phone}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Дата *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Товары в заказе</label>
              {formData.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
                  <div style={{ flex: 2 }}>
                    <select
                      value={item.furniture_id}
                      onChange={(e) => updateOrderItem(index, 'furniture_id', e.target.value)}
                      className="form-control"
                      required
                    >
                      <option value="">Выберите товар</option>
                      {furniture.filter(f => f.quantity > 0).map(f => (
                        <option key={f.id} value={f.id}>
                          {f.name} - {f.price} ₽ (в наличии: {f.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                      className="form-control"
                      placeholder="Количество"
                      min="1"
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                      className="form-control"
                      placeholder="Цена"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemFromOrder(index)}
                    className="btn btn-sm btn-danger"
                  >
                    Удалить
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItemToOrder}
                className="btn btn-secondary"
              >
                Добавить товар
              </button>
            </div>

            {formData.items.length > 0 && (
              <div className="form-group">
                <strong>
                  Общая сумма: {formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('ru-RU')} ₽
                </strong>
              </div>
            )}
            
            <div className="btn-group">
              <button type="submit" className="btn btn-success">
                Создать заказ
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
              <th>Клиент</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Заказы не найдены</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <strong>{order.client_name}</strong>
                    <br />
                    <small>{order.client_phone}</small>
                  </td>
                  <td>{new Date(order.date).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={getStatusClass(order.status)}
                      style={{ border: 'none', background: 'transparent' }}
                    >
                      <option value="pending">В ожидании</option>
                      <option value="completed">Выполнен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </td>
                  <td><strong>{order.total_amount?.toLocaleString('ru-RU') || '0'} ₽</strong></td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => viewOrderDetails(order.id)}
                      >
                        Детали
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(order.id)}
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

      {selectedOrder && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Детали заказа #{selectedOrder.id}</h2>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedOrder(null)}
            >
              Закрыть
            </button>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Клиент:</strong> {selectedOrder.client_name}</p>
            <p><strong>Телефон:</strong> {selectedOrder.client_phone}</p>
            <p><strong>Адрес:</strong> {selectedOrder.client_address}</p>
            <p><strong>Дата:</strong> {new Date(selectedOrder.date).toLocaleDateString('ru-RU')}</p>
            <p><strong>Статус:</strong> <span className={getStatusClass(selectedOrder.status)}>{getStatusText(selectedOrder.status)}</span></p>
          </div>

          <h3 style={{ marginTop: '1.5rem' }}>Товары в заказе:</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Тип</th>
                  <th>Количество</th>
                  <th>Цена за единицу</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.furniture_name}</td>
                    <td>{item.furniture_type}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString('ru-RU')} ₽</td>
                    <td><strong>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <h3>Итого: {selectedOrder.total_amount?.toLocaleString('ru-RU') || '0'} ₽</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders; 