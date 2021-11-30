import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddTarget from './components/AddTarget';

function App() {
  const adminInfo = localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')) : null
  console.log(adminInfo)
  return (
    <div className="App">
      <BrowserRouter>
      {adminInfo ? <Routes>
          <Route path="/dashboard" element={<Dashboard />} adminInfo={adminInfo} />
          <Route path="/addtarget" element={<AddTarget />} adminInfo={adminInfo} />
        </Routes> : <Routes>
          <Route path="/" element={<Login />}/>
        </Routes>}        
      </BrowserRouter>
    </div>
  );
}

export default App;
