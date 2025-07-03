import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function StudentPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Новое состояние для отображения пароля

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Переключаем состояние видимости пароля
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!login.trim()) {
      setError('Введите логин');
      return;
    }
    
    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }

    console.log('Отправка данных:', { login, password });
    // navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Вход для студентов</h1>
      <div className="auth-box">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Логин:</label>
            <input
              type="text"
              id="login"
              placeholder="Введите ваш логин"
              value={login}
              onChange={handleLoginChange}
              className="login-input"
            />
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password">Пароль:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Введите ваш пароль"
                value={password}
                onChange={handlePasswordChange}
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="role-button login-button"
              onClick={() => navigate('/admin')}
            >
    
              Войти
            </button>
            
            <button 
              type="button" 
              className="role-button secondary-button"
              onClick={() => navigate('/')}
            >
              На главную
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}