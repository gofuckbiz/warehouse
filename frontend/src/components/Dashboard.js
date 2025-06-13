import React, { useState, useEffect } from 'react';
import { suppliersAPI, clientsAPI, furnitureAPI, ordersAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    suppliers: 0,
    clients: 0,
    furniture: 0,
    orders: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [suppliersRes, clientsRes, furnitureRes, ordersRes] = await Promise.all([
        suppliersAPI.getAll(),
        clientsAPI.getAll(),
        furnitureAPI.getAll(),
        ordersAPI.getAll()
      ]);

      const furniture = furnitureRes.data;
      const totalValue = furniture.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      setStats({
        suppliers: suppliersRes.data.length,
        clients: clientsRes.data.length,
        furniture: furniture.length,
        orders: ordersRes.data.length,
        totalValue
      });
    } catch (err) {
      setError('Ошибка загрузки статистики');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка статистики...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h1>Панель управления</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>Поставщики</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginTop: '0.5rem' }}>
            {stats.suppliers}
          </div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Всего поставщиков</p>
        </div>

        <div className="card">
          <h3>Клиенты</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', marginTop: '0.5rem' }}>
            {stats.clients}
          </div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Всего клиентов</p>
        </div>

        <div className="card">
          <h3>Мебель</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fd7e14', marginTop: '0.5rem' }}>
            {stats.furniture}
          </div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Наименований товаров</p>
        </div>

        <div className="card">
          <h3>Заказы</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545', marginTop: '0.5rem' }}>
            {stats.orders}
          </div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Всего заказов</p>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3>Общая стоимость товаров на складе</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6f42c1', marginTop: '0.5rem' }}>
            {stats.totalValue.toLocaleString('ru-RU')} ₽
          </div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Стоимость всех товаров в наличии</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Добро пожаловать в систему учета мебельного склада!</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#666' }}>
          Эта система позволяет вам эффективно управлять складскими операциями:
        </p>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem', color: '#666' }}>
          <li>Ведите учет поставщиков и их контактной информации</li>
          <li>Управляйте базой клиентов</li>
          <li>Отслеживайте остатки мебели на складе</li>
          <li>Создавайте и обрабатывайте заказы</li>
          <li>Контролируйте движение товаров</li>
        </ul>
        <div className="btn-group" style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={loadStats}>
            Обновить статистику
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 