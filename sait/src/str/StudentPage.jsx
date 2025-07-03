import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const useLanguage = () => {
  const [language] = useState(() => {
    return localStorage.getItem('appLanguage') || 'ru';
  });
  return language;
};

export default function StudentPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const language = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const pageTexts = {
    ru: {
      title: 'Вход для студентов',
      loginLabel: 'Логин',
      loginPlaceholder: 'Введите имя пользователя',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Введите пароль',
      showPassword: 'Показать пароль?',
      submitButton: 'Войти',
      homeButton: 'На главную',
      error: 'Неверные учетные данные'
    },
    en: {
      title: 'Student Login',
      loginLabel: 'Login',
      loginPlaceholder: 'Enter username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password',
      showPassword: 'Show password?',
      submitButton: 'Log In',
      homeButton: 'Home',
      error: 'Invalid credentials'
    }
  };

  const t = (key) => pageTexts[language][key] || key;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: login,
          password: password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userType', data.user_type);
        localStorage.setItem('fullName', data.full_name);
        localStorage.setItem('studentId', data.id);
        navigate('/student_acc');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || t('error'));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">{t('title')}</h1>
      <div className="auth-box">
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">{t('loginLabel')}</label>
            <input
              type="text"
              id="login"
              placeholder={t('loginPlaceholder')}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="login-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('passwordLabel')}</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              required
            />
            <div className="show-password-checkbox">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" style={{color: 'gray'}}>
                {t('showPassword')}
              </label>
            </div>
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="role-button login-button"
            >
              {t('submitButton')}
            </button>
            
            <button 
              type="button" 
              className="role-button secondary-button"
              onClick={() => navigate('/')}
            >
              {t('homeButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}