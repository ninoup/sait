import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function StudentAccount() {
  const [formData, setFormData] = useState({
    group: '',
    curator: '',
    olympiad: '',
    description: '',
    file: null
  });

  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const curators = ['Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      if (file.type === 'application/pdf') {
        setFormData(prev => ({
          ...prev,
          file: file
        }));
      } else {
        alert('Пожалуйста, загрузите файл в формате PDF');
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправленные данные:', formData);
    alert('Анкета отправлена!');
  };

  const handleReset = () => {
    setFormData({
      group: '',
      curator: '',
      olympiad: '',
      description: '',
      file: null
    });
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Анкета участника</h1>
      <div className="auth-box">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>
              Группа:
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
              placeholder="Введите номер группы"
            />
          </div>

          <div className="form-group">
            <label>
              Куратор:
              <span className="required-star">*</span>
            </label>
            <select
              name="curator"
              value={formData.curator}
              onChange={handleChange}
              required
            >
              <option value="">Выберите куратора</option>
              {curators.map((curator, index) => (
                <option key={index} value={curator}>{curator}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Олимпиада:
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="olympiad"
              value={formData.olympiad}
              onChange={handleChange}
              required
              placeholder="Введите название олимпиады"
            />
          </div>

          <div className="form-group">
            <label>Описание:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание (необязательно)"
            />
          </div>

          <div className="form-group">
            <label>
              Прикрепить PDF файл:
              <span className="required-star">*</span>
            </label>
            <div 
              className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="file-info">
                  <p>Выбран файл: {formData.file.name}</p>
                  <button 
                    type="button" 
                    className="change-file-button"
                    onClick={() => setFormData(prev => ({...prev, file: null}))}
                  >
                    Изменить файл
                  </button>
                </div>
              ) : (
                <>
                  <p>Перетащите PDF файл сюда или</p>
                  <label htmlFor="file-upload" className="file-upload-label">
                    Выберите файл
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </div>
          </div>

          <div className="buttons-container">
            <button type="button" className="reset-button" onClick={handleReset}>
              Очистить
            </button>
            <button type="submit" className="submit-button">
              Отправить
            </button>
            <button 
              type="button" 
              className="back-button"
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

export default StudentAccount;