import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(5px)'
    }}>
      <motion.div
        className="card"
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          margin: '20px',
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          variants={itemVariants}
          style={{
            background: 'linear-gradient(135deg, #ffffff, #cccccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          Вход в систему
        </motion.h2>
        
        {error && (
          <motion.div 
            className="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div className="form-group" variants={itemVariants}>
            <label>Имя пользователя или Email</label>
            <motion.input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Введите имя пользователя или email"
              style={{
                background: 'rgba(45, 45, 45, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
              whileFocus={{ 
                scale: 1.02,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)'
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label>Пароль</label>
            <motion.input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Введите пароль"
              style={{
                background: 'rgba(45, 45, 45, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
              whileFocus={{ 
                scale: 1.02,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)'
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
              color: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            disabled={loading}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: 'inline-block', marginRight: '0.5rem' }}
              >
                ⟳
              </motion.div>
            ) : null}
            {loading ? 'Вход...' : 'Войти'}
          </motion.button>
        </form>

        <motion.div 
          className="text-center"
          variants={itemVariants}
          style={{ marginTop: '1.5rem' }}
        >
          <span style={{ color: '#999', fontSize: '0.9rem' }}>Нет аккаунта? </span>
          <Link 
            to="/register" 
            style={{ 
              color: '#ffffff', 
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #ffffff, #cccccc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottomColor = 'white';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottomColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Зарегистрироваться
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login; 