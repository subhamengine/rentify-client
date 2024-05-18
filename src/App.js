import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Properties from "./pages/Properties";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  return (
    <BrowserRouter>
      <Routes>
        
        
        <Route
              path="/properties"
              element={user && user.user ? <Properties /> : <Navigate to='/'/>}
            />
            <Route exact path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
