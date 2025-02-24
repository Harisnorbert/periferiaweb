import React, {useState} from 'react';
import './App.css';
import TermekLista from './components/TermekLista';
import Kosar from './components/Kosar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FizetesOldal from './components/FizetesOldal';


  function App() {
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
      </header>
      <main>
        <Routes>
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
