import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './str/Welcome';
import StudentPage from './str/StudentPage';
import StudentAccount from './str/StudentAccount';
import React from 'react';
import './App.css';
import AdminPage from './str/AdminPage';
import AdminAccount from './str/AdminAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin_vhod" element={<AdminPage />} />
        <Route path="/admin_acc" element={<AdminAccount />} />
        <Route path="/student_acc" element={<StudentAccount />} />
      </Routes>
    </Router>
  );
}

export default App;