import '../App.css';
import { useNavigate } from 'react-router-dom'; // Добавляем хук навигации

function Logo() {
  return (
    <img 
      src="http://localhost:8000/static/photo.jpg"  
      style={{ width: '200px', height: 'auto' }}
      alt="Логотип СПбГАСУ"
    />
  );
}

function Header() {
  return <h1 className="auth-title">Достижения студентов</h1>;
}

function Button_one_str() {
  const navigate = useNavigate(); // Используем хук навигации

  return (
    <div className="button-group">
      <button 
        className="role-button student-button"
        onClick={() => navigate('/student')} // Переход на страницу студента
      >
        Студент
      </button>
      <button className="role-button admin-button">
        Администрация
      </button>
    </div>
  );
}

function Podpis() {
  return (
    <div className="footer">
      <p>
        2025 © Санкт-Петербургский государственный архитектурно-строительный университет{' '}
        <a 
          href="https://www.spbgasu.ru/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{color: '#ab432b'}}
        >
          (СПбГАСУ)
        </a>
      </p>
    </div>
  );
}

function One_str() {
  return (
    <div className="auth-container">
      <Logo /> 
      <div className="auth-box">
        <Header/>
        <Button_one_str/>
        <Podpis />
      </div>
    </div>
  );
}

export default function Welcome() {
  return <One_str />;
}