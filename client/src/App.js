import React, { useState, useEffect } from "react";
import "./App.css";
import TermekLista from "./components/TermekLista";
import Kosar from "./components/Kosar";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import FizetesOldal from "./components/FizetesOldal";
import Regisztracio from "./components/Regisztracio";
import Bejelentkezes from "./components/Bejelentkezes";
import Profil from "./components/Profil";


function App() {
  const [felhasznalo, setFelhasznalo] = useState(JSON.parse(localStorage.getItem("felhasznalo")) || null);
  const [kosar, setKosar] = useState(() => {
    return JSON.parse(localStorage.getItem("kosar")) || [];
  });

  const navigate = useNavigate();

  // **Kosár mentése minden módosítás után**
  useEffect(() => {
    localStorage.setItem("kosar", JSON.stringify(kosar));
  }, [kosar]);

  // **Termék hozzáadása a kosárhoz**
  const hozzaadKosarhoz = (termek) => {
    setKosar((elozoKosar) => {
      const ujKosar = [...elozoKosar, termek];
      localStorage.setItem("kosar", JSON.stringify(ujKosar)); // Kosár mentése a localStorage-ba
      return ujKosar;
    });
  };

  // **Termék törlése a kosárból**
  const torlesKosarbol = (index) => {
    setKosar((elozoKosar) => {
      const ujKosar = elozoKosar.filter((_, i) => i !== index);
      localStorage.setItem("kosar", JSON.stringify(ujKosar));
      return ujKosar;
    });
  };

  // **Kosár teljes ürítése**
  const kosarUrites = () => {
    setKosar([]);
    localStorage.removeItem("kosar");
  };

  return (
    <div className="App">
      <header className="App-header">
  <div className="nav-container">
    <h1>Periferiaweb</h1>
    <p>Itt mindent megtalálsz, ami a gaminghez kell!</p>

    <nav className="navbar">
      <Link to="/" className="nav-link">Főoldal</Link>

      <Link to="/FizetesOldal" className="nav-link">
        Kosár ({kosar.length}) - {kosar.reduce((sum, item) => sum + (Number(item.ar) || Number(item.price) || 0), 0)} Ft
      </Link>


      {felhasznalo ? (
        <div className="user-info">
          <Link to="/profil" className="profil-link">Üdv, {felhasznalo.nev}!</Link>
          <button className="logout-btn"onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("felhasznalo");
                setFelhasznalo(null);
                kosarUrites();
                navigate("/bejelentkezes");
              }}>Kijelentkezés</button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/regisztracio" className="nav-link">Regisztráció</Link>
          <Link to="/bejelentkezes" className="nav-link">Bejelentkezés</Link>
        </div>
      )}
    </nav>
  </div>
</header>
      <main>
        <Routes>
          <Route path="/profil" element={<Profil felhasznalo={felhasznalo} />} />
          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/bejelentkezes" element={<Bejelentkezes setFelhasznalo={setFelhasznalo} />} />
          <Route path="/FizetesOldal" element={<FizetesOldal kosar={kosar} setKosar={setKosar} kosarUrites={kosarUrites} felhasznalo={felhasznalo} />} />
          <Route path="/" element={<><TermekLista hozzaadKosarhoz={hozzaadKosarhoz} /><Kosar kosar={kosar} torlesKosarbol={torlesKosarbol} /></>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
