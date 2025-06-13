import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { suppliersAPI, clientsAPI, furnitureAPI, ordersAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    suppliers: 0,
    clients: 0,
    furniture: 0,
    orders: 0,
    totalValue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalOrderValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    topClients: [],
    recentOrders: []
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
      const orders = ordersRes.data;
      const clients = clientsRes.data;

      // Основная статистика
      const totalValue = furniture.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Статистика по заказам
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'completed').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
      const totalOrderValue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Статистика по складу
      const lowStockItems = furniture.filter(item => item.quantity > 0 && item.quantity <= 5).length;
      const outOfStockItems = furniture.filter(item => item.quantity === 0).length;

      // Топ клиенты по количеству заказов
      const clientOrderCounts = {};
      orders.forEach(order => {
        const clientId = order.client_id;
        clientOrderCounts[clientId] = (clientOrderCounts[clientId] || 0) + 1;
      });

      const topClients = clients
        .map(client => ({
          ...client,
          orderCount: clientOrderCounts[client.id] || 0,
          totalSpent: orders
            .filter(order => order.client_id === client.id)
            .reduce((sum, order) => sum + (order.total_amount || 0), 0)
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 5);

      // Последние заказы
      const recentOrders = orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setStats({
        suppliers: suppliersRes.data.length,
        clients: clients.length,
        furniture: furniture.length,
        orders: orders.length,
        totalValue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalOrderValue,
        lowStockItems,
        outOfStockItems,
        topClients,
        recentOrders
      });
    } catch (err) {
      setError('Ошибка загрузки статистики');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.3
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-spinner"></div>
        <p>Загрузка статистики...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="error"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Панель управления
      </motion.h1>
      
      <motion.div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginTop: '1rem' 
        }}
        variants={containerVariants}
      >
        <motion.div className="card" variants={cardVariants} whileHover={{ scale: 1.05 }}>
          <h3>Поставщики</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80', marginTop: '0.5rem' }}
            variants={numberVariants}
          >
            {stats.suppliers}
          </motion.div>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Всего поставщиков</p>
        </motion.div>

        <motion.div className="card" variants={cardVariants} whileHover={{ scale: 1.05 }}>
          <h3>Клиенты</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa', marginTop: '0.5rem' }}
            variants={numberVariants}
          >
            {stats.clients}
          </motion.div>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Всего клиентов</p>
        </motion.div>



        <motion.div className="card" variants={cardVariants} whileHover={{ scale: 1.05 }}>
          <h3>Заказы</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f87171', marginTop: '0.5rem' }}
            variants={numberVariants}
          >
            {stats.orders}
          </motion.div>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Всего заказов</p>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            <div style={{ color: '#fbbf24' }}>В ожидании: {stats.pendingOrders}</div>
            <div style={{ color: '#22c55e' }}>Выполнено: {stats.completedOrders}</div>
            <div style={{ color: '#ef4444' }}>Отменено: {stats.cancelledOrders}</div>
          </div>
        </motion.div>

        <motion.div className="card" variants={cardVariants} whileHover={{ scale: 1.05 }}>
          <h3>Склад</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a78bfa', marginTop: '0.5rem' }}
            variants={numberVariants}
          >
            {stats.furniture}
          </motion.div>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Наименований товаров</p>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            <div style={{ color: '#fbbf24' }}>Мало на складе: {stats.lowStockItems}</div>
            <div style={{ color: '#ef4444' }}>Нет в наличии: {stats.outOfStockItems}</div>
          </div>
        </motion.div>

        <motion.div 
          className="card" 
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3>Общая стоимость товаров</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a78bfa', marginTop: '0.5rem' }}
            variants={numberVariants}
          >
            {stats.totalValue.toLocaleString('ru-RU')} ₽
          </motion.div>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Стоимость товаров на складе</p>
        </motion.div>

        <motion.div 
          className="card" 
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3>Сумма заказов</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4', marginTop: '0.5rem' }}
            variants={numberVariants}
          >
            {stats.totalOrderValue.toLocaleString('ru-RU')} ₽
          </motion.div>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Общая сумма всех заказов</p>
        </motion.div>
      </motion.div>

      {/* Топ клиенты и последние заказы */}
      <motion.div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '1.5rem', 
          marginTop: '2rem' 
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="card"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3>Топ клиенты</h3>
          {stats.topClients.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {stats.topClients.map((client, index) => (
                <motion.div 
                  key={client.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: index < stats.topClients.length - 1 ? '1px solid var(--border-gray)' : 'none'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--primary-white)' }}>
                      {client.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--light-gray)' }}>
                      {client.phone || 'Телефон не указан'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: 'var(--primary-white)' }}>
                      {client.orderCount} заказов
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--light-gray)' }}>
                      {client.totalSpent.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--light-gray)', marginTop: '1rem' }}>
              Нет данных о клиентах
            </p>
          )}
        </motion.div>

        <motion.div 
          className="card"
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
        >
          <h3>Последние заказы</h3>
          {stats.recentOrders.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {stats.recentOrders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: index < stats.recentOrders.length - 1 ? '1px solid var(--border-gray)' : 'none'
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--primary-white)' }}>
                      Заказ #{order.id}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--light-gray)' }}>
                      {order.client_name || 'Клиент не указан'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: 'var(--primary-white)' }}>
                      {(order.total_amount || 0).toLocaleString('ru-RU')} ₽
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: order.status === 'pending' ? '#fbbf24' : 
                             order.status === 'completed' ? '#22c55e' : '#ef4444'
                    }}>
                      {order.status === 'pending' ? 'В ожидании' :
                       order.status === 'completed' ? 'Выполнен' : 'Отменен'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--light-gray)', marginTop: '1rem' }}>
              Нет заказов
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Предупреждения о складе */}
      {(stats.lowStockItems > 0 || stats.outOfStockItems > 0) && (
        <motion.div 
          className="card" 
          style={{ 
            marginTop: '2rem',
            border: '1px solid #fbbf24',
            background: 'rgba(251, 191, 36, 0.1)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h3 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Предупреждения о складе
          </h3>
          <div style={{ marginTop: '1rem' }}>
            {stats.outOfStockItems > 0 && (
              <motion.div 
                style={{ 
                  padding: '0.75rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  marginBottom: '0.5rem'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <strong style={{ color: '#ef4444' }}>
                  {stats.outOfStockItems} товаров закончились на складе
                </strong>
                <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                  Требуется пополнение запасов
                </p>
              </motion.div>
            )}
            {stats.lowStockItems > 0 && (
              <motion.div 
                style={{ 
                  padding: '0.75rem', 
                  background: 'rgba(251, 191, 36, 0.1)', 
                  border: '1px solid #fbbf24',
                  borderRadius: '8px'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <strong style={{ color: '#fbbf24' }}>
                  {stats.lowStockItems} товаров заканчиваются (≤5 шт.)
                </strong>
                <p style={{ color: '#fbbf24', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                  Рекомендуется заказать дополнительные товары
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <motion.div 
        className="card" 
        style={{ marginTop: '2rem' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2>Добро пожаловать в систему учета мебельного склада!</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#999' }}>
          Эта система позволяет вам эффективно управлять складскими операциями:
        </p>
        <motion.ul 
          style={{ marginTop: '1rem', paddingLeft: '2rem', color: '#999' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.25 }}
        >
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.3 }}
          >
            Ведите учет поставщиков и их контактной информации
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            Управляйте базой клиентов
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.5 }}
          >
            Отслеживайте остатки мебели на складе
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.6 }}
          >
            Создавайте и обрабатывайте заказы
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.7 }}
          >
            Контролируйте движение товаров
          </motion.li>
        </motion.ul>
        <motion.div 
          className="btn-group" 
          style={{ marginTop: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.8 }}
        >
          <motion.button 
            className="btn btn-primary" 
            onClick={loadStats}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Обновить статистику
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard; 