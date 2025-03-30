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
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminTermekek from "./components/admin/AdminTermekek";
import AdminRendelesek from "./components/admin/AdminRendelesek";

function App() {
  const [felhasznalo, setFelhasznalo] = useState(() => {
    try {
      const raw = localStorage.getItem("felhasznalo");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [kosar, setKosar] = useState(() => {
    try {
      const raw = localStorage.getItem("kosar");
      if (!raw || raw === "undefined") return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
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
      const darab = termek.db || 1; 
      if (index !== -1) {
        const ujKosar = [...elozoKosar];
        ujKosar[index].db = (ujKosar[index].db || 1) + darab;
        return ujKosar;
      } else {
        return [...elozoKosar, { ...termek, db: darab }];
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
          <div className="nav-left">
            <h1 onClick={() => navigate("/")}>Periféria Web</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Főoldal</Link>
              <Link to="/kosar" className="nav-link">
                Kosár ({kosar.length}) - {kosar.reduce((sum, item) => sum + (Number(item.price)*Number(item.db) || 0), 0)} Ft
              </Link>
            </div>
          </div>

          <div className="nav-right">
            <div className="theme-switch" onClick={toggleTheme} aria-label="Téma váltása">
              <span className="icon moon">🌙</span>
              <span className="icon sun">☀️</span>
            </div>

            {felhasznalo ? (
              <div style={{ position: 'relative' }}>
                <button className="nav-user">
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(felhasznalo.nev)}`} alt="avatar" />
                  Üdv, {felhasznalo.nev}
                </button>
                <div className="user-dropdown">
                    <Link to="/profil">Profil</Link>
                  {felhasznalo.admin && (
                    <Link to="/admin">Admin felület</Link>
                  )}
                  <button onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("felhasznalo");
                    setFelhasznalo(null);
                    kosarUrites();
                    navigate("/bejelentkezes");
                  }}>Kijelentkezés</button>
                </div>

              </div>
            ) : (
              <>
                <Link to="/regisztracio" className="nav-link">Regisztráció</Link>
                <Link to="/bejelentkezes" className="nav-link">Bejelentkezés</Link>
              </>
            )}

            <div className="hamburger" onClick={() => {
              const menu = document.querySelector(".mobile-nav");
              menu?.classList.toggle("show");
            }}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="mobile-nav">
          <Link to="/" className="nav-link">Főoldal</Link>
          <Link to="/kosar" className="nav-link">
            Kosár ({kosar.length}) - {kosar.reduce((sum, item) => sum + (Number(item.price)*Number(item.db) || 0), 0)} Ft
          </Link>
          {!felhasznalo ? (
            <>
              <Link to="/regisztracio" className="nav-link">Regisztráció</Link>
              <Link to="/bejelentkezes" className="nav-link">Bejelentkezés</Link>
            </>
          ) : (
            <>
              <Link to="/profil" className="nav-link">Profil</Link>
              <button className="nav-link" onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("felhasznalo");
                setFelhasznalo(null);
                kosarUrites();
                navigate("/bejelentkezes");
              }}>Kijelentkezés</button>
            </>
          )}
        </div>
      </header>

      <main>
        <Routes>
        <Route path="/admin" element={<AdminDashboard />}>
        <Route path="termekek" element={<AdminTermekek />} />
        <Route path="rendelesek" element={<AdminRendelesek />} />
        </Route>
          <Route path="/kosar" element={<KosarOldal kosar={kosar} frissitDarab={frissitDarab} torlesKosarbol={torlesKosarbol}/>} />
          <Route path="/profil" element={<Profil felhasznalo={felhasznalo} setFelhasznalo={setFelhasznalo} />} />
          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/bejelentkezes" element={<Bejelentkezes setFelhasznalo={setFelhasznalo} />} />
          <Route path="/FizetesOldal" element={<FizetesOldal kosar={kosar} setKosar={setKosar} kosarUrites={kosarUrites} felhasznalo={felhasznalo} />} />
          <Route path="/" element={
            <div className="main-content">
              <TermekLista hozzaadKosarhoz={hozzaadKosarhoz} />
              <Kosar kosar={kosar} torlesKosarbol={torlesKosarbol} frissitDarab={frissitDarab} />
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
