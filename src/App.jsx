import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Home from "./components/Home.jsx";
import Demo from "./components/Demo.jsx";
import { ThemeContext } from "./ThemeContext";

function App() {
  const [DarkTheme, setDarkTheme] = useState(true);

  return (
    <ThemeContext.Provider value={{ DarkTheme, setDarkTheme }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </ThemeContext.Provider>
  );
}

export default App;