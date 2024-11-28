import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<div>Paint Estimator Home</div>} />
      </Routes>
    </div>
  );
}

export default App;