import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './str/Welcome';
import StudentPage from './str/StudentPage'; // Импортируем новую страницу
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/student" element={<StudentPage />} /> {/* Новый маршрут */}
      </Routes>
    </Router>
  );
}

export default App;