import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const useLanguage = () => {
  const [language] = useState(() => {
    return localStorage.getItem('appLanguage') || 'ru';
  });
  return language;
};

export default function AdminAccount() {
  const language = useLanguage();
  const navigate = useNavigate();
  const [olympiads, setOlympiads] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOlympiads = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/admin/olympiads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        setOlympiads(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOlympiads();
  }, []);

  const pageTexts = {
    ru: {
      title: 'Управление достижениями студентов',
      logout: 'Выход',
      name: 'ФИО',
      group: 'Группа',
      achievement: 'Название олимпиады',
      type: 'Тип олимпиады',
      organization: 'Организация',
      location: 'Место проведения',
      date: 'Дата проведения',
      description: 'Описание',
      files: 'Файлы',
      download: 'Просмотреть',
      noData: 'Нет данных для отображения',
      loading: 'Загрузка данных...',
      error: 'Ошибка при загрузке данных',
      retry: 'Повторить попытку'
    },
    en: {
      title: 'Student Achievements Management',
      logout: 'Log out',
      name: 'Full Name',
      group: 'Group',
      achievement: 'Olympiad Name',
      type: 'Olympiad Type',
      organization: 'Organization',
      location: 'Location',
      date: 'Event Date',
      description: 'Description',
      files: 'Files',
      download: 'View',
      noData: 'No data to display',
      loading: 'Loading data...',
      error: 'Error loading data',
      retry: 'Retry'
    }
  };

  const t = (key) => pageTexts[language][key] || key;

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOlympiads = useMemo(() => {
    const sortableItems = [...olympiads];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [olympiads, sortConfig]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const handleViewFile = (olympiadId) => {
    window.location.href = `http://localhost:8000/olympiads/${olympiadId}/file`;
  };

  return (
    <div className="admin-page">
      <div className="admin-top-panel">
        <button onClick={handleLogout} className="logout-button">
          {t('logout')}
        </button>
      </div>

      <div className="auth-container-adm">
        <h1 className="auth-title">{t('title')}</h1>
        <div className="auth-box-adm" style={{ maxWidth: '1200px', padding: '30px' }}>
          {loading ? (
            <div className="loading-message">{t('loading')}</div>
          ) : error ? (
            <div className="error-message">
              {t('error')}: {error}
              <button 
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                {t('retry')}
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="students-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('student_full_name')} style={{ cursor: 'pointer' }}>
                      {t('name')} {sortConfig.key === 'student_full_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => requestSort('student_group')} style={{ cursor: 'pointer' }}>
                      {t('group')} {sortConfig.key === 'student_group' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => requestSort('title')} style={{ cursor: 'pointer' }}>
                      {t('achievement')} {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => requestSort('level')} style={{ cursor: 'pointer' }}>
                      {t('type')} {sortConfig.key === 'level' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => requestSort('organizer')} style={{ cursor: 'pointer' }}>
                      {t('organization')} {sortConfig.key === 'organizer' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => requestSort('venue')} style={{ cursor: 'pointer' }}>
                      {t('location')} {sortConfig.key === 'venue' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => requestSort('date')} style={{ cursor: 'pointer' }}>
                      {t('date')} {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => requestSort('description')} style={{ cursor: 'pointer' }}>
                      {t('description')} {sortConfig.key === 'description' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>{t('files')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOlympiads.length > 0 ? (
                    sortedOlympiads.map((olympiad) => (
                      <tr key={olympiad.id}>
                        <td>{olympiad.student_full_name}</td>
                        <td>{olympiad.student_group}</td>
                        <td>{olympiad.title}</td>
                        <td>{olympiad.level}</td>
                        <td>{olympiad.organizer}</td>
                        <td>{olympiad.venue}</td>
                        <td>{new Date(olympiad.date).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}</td>
                        <td>{olympiad.description}</td>
                        <td>
                          <button 
                            onClick={() => handleViewFile(olympiad.id)}
                            className="file-link"
                          >
                            {t('download')}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center' }}>{t('noData')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}