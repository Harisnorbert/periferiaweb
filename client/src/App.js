import React, { useState, useEffect } from "react";
import "./App.css";
import TermekLista from "./components/TermekLista";
import Kosar from "./components/Kosar";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import FizetesOldal from "./components/FizetesOldal";
import Regisztracio from "./components/Regisztracio";
import Bejelentkezes from "./components/Bejelentkezes";
import axios from "axios";

function App() {
  const [felhasznalo, setFelhasznalo] = useState(JSON.parse(localStorage.getItem("felhasznalo")) || null);
  const [kosar, setKosar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Felhasználói adatok lekérése
      axios.get("http://localhost:5000/felhasznalo", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        setFelhasznalo(response.data.felhasznalo);
      }).catch((error) => {
        console.error("Hiba a felhasználói adatok lekérésekor:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("felhasznalo");
        setFelhasznalo(null);
      });

      // Kosár betöltése
      axios.get("http://localhost:5000/kosar", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        setKosar(res.data.kosar || []);
        localStorage.setItem("kosar", JSON.stringify(res.data.kosar || []));
      }).catch((error) => {
        console.error("Hiba a kosár betöltésekor:", error);
      });
    }
  }, []); // Csak egyszer, ha a token elérhető

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const kijelentkezes = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("felhasznalo");
    localStorage.removeItem("kosar");
    setFelhasznalo(null);
    setKosar([]);

    // Kosár ürítése, de nem küldjük el a kérdést, ha már nincs token
    const token = localStorage.getItem("token");
    if (token) {
      axios.post("http://localhost:5000/kosar", { kosar: [] }, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch((error) => console.error("Hiba a szerver kosár ürítésekor:", error));
    }

    navigate("/"); // Visszairányítjuk a felhasználót a főoldalra
  };

  const hozzaadKosarhoz = (termek) => {
    setKosar((elozoKosar) => {
      const ujKosar = [...elozoKosar, {
        ...termek,
        ar: Number(termek.price || termek.ar),
        nev: termek.name || termek.nev,
        leiras: termek.description || termek.leiras || "",
      }];
      localStorage.setItem("kosar", JSON.stringify(ujKosar));
      return ujKosar;
    });
  };

  const kosarUrites = () => {
    setKosar([]);
    localStorage.removeItem("kosar");
  };

  const torlesKosarbol = (index) => {
    setKosar((elozoKosar) => {
      const ujKosar = elozoKosar.filter((_, i) => i !== index);
      localStorage.setItem("kosar", JSON.stringify(ujKosar));
      return ujKosar;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Periferiaweb</h1>
        <p>Itt mindent megtalálsz, ami a gaminghez kell!</p>
        <nav>
          <Link to="/">Főoldal</Link>
          {felhasznalo ? (
            <>
              <span>Üdv, {felhasznalo.nev}!</span>
              <button onClick={kijelentkezes}>Kijelentkezés</button>
            </>
          ) : (
            <>
              <Link to="/regisztracio">Regisztráció</Link>
              <Link to="/bejelentkezes">Bejelentkezés</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/bejelentkezes" element={<Bejelentkezes setFelhasznalo={setFelhasznalo} setKosar={setKosar} />} />
          <Route path="/FizetesOldal" element={<FizetesOldal kosar={kosar} kosarUrites={kosarUrites} setFelhasznalo={setFelhasznalo} />} />
          <Route path="/" element={<><TermekLista termekek={[]} hozzaadKosarhoz={hozzaadKosarhoz} /><Kosar kosar={kosar} torlesKosarbol={torlesKosarbol} /></>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
