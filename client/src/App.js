import React, { useState, useEffect } from "react";
import "./components/gameresui.css";
import TermekLista from "./components/TermekLista";
import Kosar from "./components/Kosar";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import FizetesOldal from "./components/FizetesOldal";
import Regisztracio from "./components/Regisztracio";
import Bejelentkezes from "./components/Bejelentkezes";
import Profil from "./components/Profil";
import KosarOldal from "./components/KosarOldal";

function App() {
  const [felhasznalo, setFelhasznalo] = useState(JSON.parse(localStorage.getItem("felhasznalo")) || null);
  const [kosar, setKosar] = useState(() => {
    return JSON.parse(localStorage.getItem("kosar")) || [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("kosar", JSON.stringify(kosar));
  }, [kosar]);

  useEffect(() => {
    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
  };

  const hozzaadKosarhoz = (termek) => {
    setKosar((elozoKosar) => {
      const index = elozoKosar.findIndex(t => t.name === termek.name);
      if (index !== -1) {
        const ujKosar = [...elozoKosar];
        ujKosar[index].db = (ujKosar[index].db || 1) + 1;
        return ujKosar;
      } else {
        return [...elozoKosar, { ...termek, db: 1 }];
      }
    });
  };

  const torlesKosarbol = (index) => {
    setKosar((elozoKosar) => {
      const ujKosar = elozoKosar.filter((_, i) => i !== index);
      localStorage.setItem("kosar", JSON.stringify(ujKosar));
      return ujKosar;
    });
  };

  const kosarUrites = () => {
    setKosar([]);
    localStorage.removeItem("kosar");
  };

  const frissitDarab = (index, valtozas) => {
    setKosar((elozo) => {
      const ujKosar = [...elozo];
      const aktualis = ujKosar[index];
      aktualis.db = Math.max(1, (aktualis.db || 1) + valtozas);
      return ujKosar;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
  <div className="nav-container">
    <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Periféria Web</h1>

    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Főoldal</Link>
        <Link to="/kosar" className="nav-link">
          Kosár ({kosar.length}) - {kosar.reduce((sum, item) => sum + (Number(item.price)*Number(item.db) || 0), 0)} Ft
        </Link>
      </div>

      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggleTheme}>Téma</button>

        {felhasznalo ? (
          <>
            <Link to="/profil" className="nav-user">Üdv, {felhasznalo.nev}!</Link>
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("felhasznalo");
              setFelhasznalo(null);
              kosarUrites();
              navigate("/bejelentkezes");
            }}>Kijelentkezés</button>
          </>
        ) : (
          <>
            <Link to="/regisztracio" className="nav-link">Regisztráció</Link>
            <Link to="/bejelentkezes" className="nav-link">Bejelentkezés</Link>
          </>
        )}
      </div>
    </nav>
  </div>
</header>

      <main>
        <Routes>
          <Route path="/kosar" element={<KosarOldal kosar={kosar} frissitDarab={frissitDarab} torlesKosarbol={torlesKosarbol}/>} />
          <Route path="/profil" element={<Profil felhasznalo={felhasznalo} setFelhasznalo={setFelhasznalo} />} />
          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/bejelentkezes" element={<Bejelentkezes setFelhasznalo={setFelhasznalo} />} />
          <Route path="/FizetesOldal" element={<FizetesOldal kosar={kosar} setKosar={setKosar} kosarUrites={kosarUrites} felhasznalo={felhasznalo} />} />
          <Route path="/" element={<>
            <div className="container">
              <TermekLista hozzaadKosarhoz={hozzaadKosarhoz} />
              <Kosar kosar={kosar} torlesKosarbol={torlesKosarbol} frissitDarab={frissitDarab} />
            </div>
          </>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
