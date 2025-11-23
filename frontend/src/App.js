import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyList from './pages/MyList';
import AddContent from './pages/AddContent';
import ContentDetail from './pages/ContentDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/add" element={<AddContent />} />
          <Route path="/content/:id" element={<ContentDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

