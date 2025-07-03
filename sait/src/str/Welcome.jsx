import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    return savedLanguage && savedLanguage !== 'undefined' ? savedLanguage : 'ru';
  });

  const updateLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  return { language, updateLanguage };
};

function ThemeToggle({ language, onLanguageChange }) {
  const [activeTheme, setActiveTheme] = useState(null); 
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setLanguageMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const languageMenuRef = useRef(null);

  const translations = {
    ru: {
      settings: 'Настройки',
      normalMode: 'Обычный режим',
      accessibilityMode: 'Режим для слабовидящих',
      lightTheme: 'Светлая тема',
      darkTheme: 'Тёмная тема',
      changeLanguage: 'Изменить язык',
      russian: 'Русский',
      english: 'English'
    },
    en: {
      settings: 'Settings',
      normalMode: 'Normal mode',
      accessibilityMode: 'Accessibility mode',
      lightTheme: 'Light theme',
      darkTheme: 'Dark theme',
      changeLanguage: 'Change language',
      russian: 'Russian',
      english: 'English'
    }
  };

  const t = (key) => translations[language][key];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = (theme) => {
    document.body.classList.remove('dark-mode', 'accessibility-mode');
    
    if (activeTheme === theme) {
      setActiveTheme(null);
    } else {
      setActiveTheme(theme);
      document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'accessibility-mode');
    }
  };

  const handleLanguageChange = (lang) => {
    onLanguageChange(lang);
    setLanguageMenuOpen(false);
  };

  return (
    <div className="theme-toggle-container">
      <button 
        className="theme-toggle-button"
        onClick={() => setMenuOpen(!isMenuOpen)}
        aria-label={t('settings')}
      >
        ☰
      </button>
      
      {isMenuOpen && (
        <div className="theme-dropdown-menu" ref={menuRef} onClick={e => e.stopPropagation()}>
          <button
            className="theme-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme('accessibility');
            }}
          >
            {activeTheme === 'accessibility' ? t('normalMode') : t('accessibilityMode')}
          </button>
          <button
            className="theme-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme('dark');
            }}
          >
            {activeTheme === 'dark' ? t('lightTheme') : t('darkTheme')}
          </button>
          <div 
            className="language-menu-container"
            onMouseEnter={() => setLanguageMenuOpen(true)}
            onMouseLeave={() => setLanguageMenuOpen(false)}
            ref={languageMenuRef}
          >
            <button
              className="theme-menu-item"
              onClick={(e) => {
                e.stopPropagation();
                setLanguageMenuOpen(!isLanguageMenuOpen);
              }}
            >
              {t('changeLanguage')} →
            </button>
            {isLanguageMenuOpen && (
              <div className="language-submenu">
                <button
                  className="theme-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLanguageChange('ru');
                  }}
                >
                  {t('russian')}
                </button>
                <button
                  className="theme-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLanguageChange('en');
                  }}
                >
                  {t('english')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function Logo() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    checkTheme();

    return () => observer.disconnect();
  }, []);

  return (
    <img 
      src={isDarkMode 
        ? "http://localhost:8000/static/GASUBLACK.jpg" 
        : "http://localhost:8000/static/photo.jpg"}  
      className="logo-image"
      alt="Логотип СПбГАСУ"
    />
  );
}

function Header({ language }) {
  const title = language === 'ru' ? 'Достижения студентов' : 'Student Achievements';
  return <h1 className="auth-title">{title}</h1>;
}

function Button_one_str({ language }) {
  const navigate = useNavigate();

  return (
    <div className="button-group">
      <button 
        className="role-button student-button"
        onClick={() => navigate('/student')}
      >
        {language === 'ru' ? 'Студент' : 'Student'}
      </button>
      
      <button 
        className="role-button admin-button"
        onClick={() => navigate('/admin_vhod')}
      >
        {language === 'ru' ? 'Администрация' : 'Administration'}
      </button>
    </div>
  );
}

function Podpis({ language }) {
  const text = language === 'ru' 
    ? '2025 © Санкт-Петербургский государственный архитектурно-строительный университет'
    : '2025 © Saint Petersburg State University of Architecture and Civil Engineering';

  return (
    <div className="footer">
      <p>
        {text}{' '}
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
  const { language, updateLanguage } = useLanguage();

  return (
    <div className="auth-container">
      <ThemeToggle language={language} onLanguageChange={updateLanguage} />
      <Logo /> 
      <div className="auth-box">
        <Header language={language} />
        <Button_one_str language={language} />
        <Podpis language={language} />
      </div>
    </div>
  );
}

export default function Welcome() {
  return <One_str />;
}