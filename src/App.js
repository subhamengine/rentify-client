import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Properties from "./pages/Properties";
import { useEffect, useLayoutEffect, useState } from "react";

function App () {
 
  const user =  JSON.parse(localStorage.getItem("user"));



  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<DefaultContainer />} />
    </Routes>
  </BrowserRouter>
  );
}


function DefaultContainer() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
      
          <Routes>
            <Route
              path="/properties"
              element={user && user.user ? <Properties /> : <Navigate to="/" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
  );
}

export default App;
