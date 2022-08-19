import React from 'react';
import './App.css';
import AdminArea from './components/AdminArea/AdminArea';
import AppiontmentPage from './components/AppointmentPage/AppointmentPage';

function App() {


  return (
    <div className="App">
      {currentPage()}

    </div>
  );
}

function currentPage() {
  const path = window.location.pathname;
  console.log(path);
  switch (path) {
    case '/crm-client/':
    case '/':
      return <AppiontmentPage></AppiontmentPage>
    case '/admin':
      return <AdminArea></AdminArea>
    default:
      break;
  }
}

export default App;
