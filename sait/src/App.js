import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './str/Welcome';
import StudentPage from './str/StudentPage';
import StudentAccount from './str/StudentAccount';
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/admin" element={<StudentAccount />} />
      </Routes>
    </Router>
  );
}

export default App;