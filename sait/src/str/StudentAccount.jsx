import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const useLanguage = () => {
  const [language] = useState(() => {
    return localStorage.getItem('appLanguage') || 'ru';
  });
  return language;
};

export default function StudentAccount() {
  const language = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    curator: '',
    olympiad: '',
    type: '',
    organization: '',
    location: '',
    eventDate: '',
    description: '',
    file: null
  });

  const [curators, setCurators] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'student') {
      navigate('/student');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCurators = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/admins', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurators(data);
        }
      } catch (error) {
        console.error('Error fetching curators:', error);
      }
    };

    fetchCurators();
  }, []);

  const pageTexts = {
    ru: {
      title: 'Анкета участника',
      logout: 'Выход',
      curator: 'Куратор',
      achievement: 'Достижение',
      achievementType: 'Тип достижения',
      organization: 'Организация',
      location: 'Место проведения',
      date: 'Дата проведения',
      description: 'Описание',
      attachFile: 'Прикрепить файл (PDF, PNG, JPG, GIF)',
      selectPlaceholder: 'Выберите',
      requiredField: '*',
      datePlaceholder: 'дд.мм.гггг',
      clear: 'Очистить',
      submit: 'Отправить',
      submitting: 'Отправка...',
      changeFile: 'Изменить файл',
      dragInstruction: 'Перетащите файл сюда или',
      selectFile: 'Выберите файл',
      fileError: 'Пожалуйста, загрузите файл в формате PDF, PNG, JPG или GIF',
      successMessage: 'Анкета отправлена!',
      enter: 'Введите',
      selectedFile: 'Выбранный файл',
      dateFormatError: 'Пожалуйста, введите дату в формате ДД.ММ.ГГГГ'
    },
    en: {
      title: 'Participant Form',
      logout: 'Log out',
      curator: 'Curator',
      achievement: 'Achievement',
      achievementType: 'Achievement type',
      organization: 'Organization',
      location: 'Location',
      date: 'Event date',
      description: 'Description',
      attachFile: 'Attach file (PDF, PNG, JPG, GIF)',
      selectPlaceholder: 'Select',
      requiredField: '*',
      datePlaceholder: 'dd.mm.yyyy',
      clear: 'Clear',
      submit: 'Submit',
      submitting: 'Submitting...',
      changeFile: 'Change file',
      dragInstruction: 'Drag file here or',
      selectFile: 'Select file',
      fileError: 'Please upload a file in PDF, PNG, JPG or GIF format',
      successMessage: 'Form submitted successfully!',
      enter: 'Enter',
      selectedFile: 'Selected file',
      dateFormatError: 'Please enter the date in DD.MM.YYYY format'
    }
  };

  const t = (key) => pageTexts[language][key] || key;

  const achievementTypes = language === 'ru'
    ? ['Международная', 'Всероссийская', 'Городская', 'Региональная', 'Внутривузовская']
    : ['International', 'National', 'City', 'Regional', 'University'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentId');
    navigate('/');
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (['application/pdf', 'image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        setFormData(prev => ({
          ...prev,
          file: file
        }));
      } else {
        alert(t('fileError'));
      }
    }
  }, [t]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (['application/pdf', 'image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        setFormData(prev => ({
          ...prev,
          file: file
        }));
      } else {
        alert(t('fileError'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('studentId');
    
    if (!token || !studentId) {
      alert('Authentication error');
      setIsSubmitting(false);
      return;
    }

    // Проверка формата даты
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(formData.eventDate)) {
      alert(t('dateFormatError'));
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.olympiad);
    formDataToSend.append('level', formData.type);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('venue', formData.location);
    formDataToSend.append('organizer', formData.organization);
    formDataToSend.append('admin_id', formData.curator);
    formDataToSend.append('student_id', studentId);
    formDataToSend.append('date', formData.eventDate);
    
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }
    
    try {
      const response = await fetch('http://localhost:8000/olympiads', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert(t('successMessage'));
        handleReset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      curator: '',
      olympiad: '',
      type: '',
      organization: '',
      location: '',
      eventDate: '',
      description: '',
      file: null
    });
  };

  return (
    <div>
      <div className="admin-top-panel">
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          {t('logout')}
        </button>
      </div>

      <div className="auth-container">
        <h1 className="auth-title-vvod">{t('title')}</h1>
        <div className="auth-box-vvod">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                {t('curator')}
                <span className="required-star">{t('requiredField')}</span>
              </label>
              <select
                name="curator"
                value={formData.curator}
                onChange={handleChange}
                className="login-input"
                required
              >
                <option value="">{t('selectPlaceholder')} {t('curator').toLowerCase()}</option>
                {curators.map((curator) => (
                  <option key={curator.id} value={curator.id}>{curator.full_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                {t('achievement')}
                <span className="required-star">{t('requiredField')}</span>
              </label>
              <input
                type="text"
                name="olympiad"
                value={formData.olympiad}
                onChange={handleChange}
                className="login-input"
                required
                placeholder={`${t('enter')} ${t('achievement').toLowerCase()}`}
              />
            </div>

            <div className="form-group">
              <label>
                {t('achievementType')}
                <span className="required-star">{t('requiredField')}</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="login-input"
                required
              >
                <option value="">{t('selectPlaceholder')} {t('achievementType').toLowerCase()}</option>
                {achievementTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                {t('organization')}
                <span className="required-star">{t('requiredField')}</span>
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="login-input"
                required
                placeholder={`${t('enter')} ${t('organization').toLowerCase()}`}
              />
            </div>

            <div className="form-group">
              <label>
                {t('location')}
                <span className="required-star">{t('requiredField')}</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="login-input"
                required
                placeholder={`${t('enter')} ${t('location').toLowerCase()}`}
              />
            </div>

            <div className="form-group">
              <label>
                {t('date')}
                <span className="required-star">{t('requiredField')}</span>
              </label>
              <input
                type="text"
                name="eventDate"
                value={formData.eventDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 2) value = `${value.slice(0, 2)}.${value.slice(2)}`;
                  if (value.length > 5) value = `${value.slice(0, 5)}.${value.slice(5)}`;
                  if (value.length > 10) value = value.slice(0, 10);
                  setFormData(prev => ({
                    ...prev,
                    eventDate: value
                  }));
                }}
                className="login-input"
                placeholder={t('datePlaceholder')}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('description')}</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="login-input"
                placeholder={`${t('enter')} ${t('description').toLowerCase()}`}
              />
            </div>

            <div className="form-group">
              <label>
                {t('attachFile')}
                <span className="required-star">{t('requiredField')}</span>
              </label>
              <div 
                className={`login-input ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  border: isDragging ? '2px dashed #ab432b' : '1px solid #ddd'
                }}
              >
                {formData.file ? (
                  <div>
                    <p>{t('selectedFile')}: {formData.file.name}</p>
                    <button 
                      type="button" 
                      className="secondary-button-clean"
                      onClick={() => setFormData(prev => ({...prev, file: null}))}
                      style={{ marginTop: '10px' }}
                    >
                      {t('changeFile')}
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="upload-instruction">{t('dragInstruction')}</label>
                    <label htmlFor="file-upload" className="file-upload-button">
                      {t('selectFile')}
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.gif"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        required
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="secondary-button-clean" 
                onClick={handleReset}
                disabled={isSubmitting}
              >
                {t('clear')}
              </button>
              <button 
                type="submit" 
                className="role-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}