import React, {useState} from "react";
import "./App.css";
import TermekLista from "./components/TermekLista";
import Kosar from "./components/Kosar";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import FizetesOldal from "./components/FizetesOldal";
import Regisztracio from "./components/Regisztracio";
import Bejelentkezes from "./components/Bejelentkezes";


  function App() {
    const [felhasznalo, setFelhasznalo] = useState(null);

    const kijelentkezes = () => {
      localStorage.removeItem("token");
      setFelhasznalo(null);
    };

    const [kosar, setKosar] = useState([]);
  
    const hozzaadKosarhoz = (termek) => {
      setKosar((elozoKosar) => [...elozoKosar, termek]);
    };
  
    const torlesKosarbol = (index) => {
      setKosar((elozoKosar) => elozoKosar.filter((_, i) => i !== index));
    };

    const kosarUrites = () => {
      setKosar([]);
    };

  return (
    <Router>
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
          <Route path="/bejelentkezes" element={<Bejelentkezes setFelhasznalo={setFelhasznalo} />} />
          <Route path="/FizetesOldal" element={<FizetesOldal kosar={kosar} kosarUrites={kosarUrites} setFelhasznalo={setFelhasznalo} />} />
          <Route path="/fizetes" element={<FizetesOldal />} />
          <Route path="/" element={
          <>
      <section id="termekek-szakasz"> 
        <TermekLista hozzaadKosarhoz={hozzaadKosarhoz} />
        <Kosar kosar={kosar} torlesKosarbol={torlesKosarbol} kosarUrites={kosarUrites} />
      </section>
      </>
      }/>
      <Route path="/FizetesOldal" element={<FizetesOldal kosar={kosar} kosarUrites={kosarUrites}/>}/>
      </Routes>
      </main>
    </div>
    </Router>
  );
}

export default App;
