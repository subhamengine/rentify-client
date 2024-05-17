import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Properties from "./pages/Properties";

function App() {



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
              path="/properties"
              element={ <Properties />}
            />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
