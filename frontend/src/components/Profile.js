import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AnimatedButton from './AnimatedButton';

function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setMessage('Профиль обновлен успешно');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        setMessage('Пароль изменен успешно');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

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
        Профиль пользователя
      </motion.h1>

      <motion.div className="card" variants={itemVariants}>
        <div className="tabs">
          <motion.button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Информация профиля
          </motion.button>
          <motion.button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Смена пароля
          </motion.button>
        </div>

        {message && (
          <motion.div 
            className="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>Информация профиля</h3>
              <form onSubmit={handleProfileSubmit}>
                <motion.div className="form-group" variants={itemVariants}>
                  <label>Имя пользователя</label>
                  <motion.input
                    type="text"
                    className="form-control"
                    value={user?.username || ''}
                    disabled
                    style={{ opacity: 0.6 }}
                    whileFocus={{ scale: 1.02 }}
                  />
                  <small style={{ color: '#999' }}>Имя пользователя нельзя изменить</small>
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label>Email</label>
                  <motion.input
                    type="email"
                    name="email"
                    className="form-control"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label>Полное имя</label>
                  <motion.input
                    type="text"
                    name="full_name"
                    className="form-control"
                    value={profileData.full_name}
                    onChange={handleProfileChange}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label>Роль</label>
                  <motion.input
                    type="text"
                    className="form-control"
                    value={user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    disabled
                    style={{ opacity: 0.6 }}
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <AnimatedButton
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Обновить профиль
                </AnimatedButton>
              </form>
            </motion.div>
          )}

          {activeTab === 'password' && (
            <motion.div
              key="password"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>Смена пароля</h3>
              <form onSubmit={handlePasswordSubmit}>
                <motion.div className="form-group" variants={itemVariants}>
                  <label>Текущий пароль</label>
                  <motion.input
                    type="password"
                    name="currentPassword"
                    className="form-control"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label>Новый пароль</label>
                  <motion.input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <small style={{ color: '#999' }}>Минимум 6 символов</small>
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label>Подтвердите новый пароль</label>
                  <motion.input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <AnimatedButton
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Изменить пароль
                </AnimatedButton>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default Profile; 