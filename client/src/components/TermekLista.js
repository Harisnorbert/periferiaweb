import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './TermekLista.css';

const TermekLista = ({ hozzaadKosarhoz }) => {
  const [termekek, setTermekek] = useState([]);
  const [kivalasztottTermek, setKivalasztottTermek]=useState(null);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  


  useEffect(() => {
    axios.get(`${API_URL}/termek`)
      .then((valasz) => {
        console.log(' Lekérdezett termékek:', valasz.data);
        setTermekek(valasz.data);
        setBetolt(false);
      })
      .catch((hiba) => {
        console.error('Hiba a termékek lekérdezésekor:', hiba);
        setHiba('Nem sikerült betölteni a termékeket.');
        setBetolt(false);
      });
  }, []);

  const reszletek=(termek)=>{
    console.log('Kiválaszott termék:',termek);
    setKivalasztottTermek(termek);
  }

  if (betolt) {
    return <p>Termékek betöltése...</p>;
  }

  if (hiba) {
    return <p>{hiba}</p>;
  }

  return (
    <section id="termekek-szakasz">
      <h2>Elérhető termékek</h2>
      <div className="termekek-container">
        {termekek.length === 0 ? (
          <p>Jelenleg nincsenek elérhető termékek.</p>
        ) : (
          termekek.map((termek) => (
            <div className="termek-kartya" key={termek._id} onClick={()=>reszletek(termek)}>
              <h3>{termek.name}</h3>
              <p>Ár: {termek.price} Ft</p>
              <p>{termek.description}</p>
            </div>
          ))
        )}
      </div>
      {kivalasztottTermek &&(
        <div className="modal">
            <div className="modal-tartalom">
                <span className="modalzaras" onClick={()=> setKivalasztottTermek(null)}>&times;</span>
                <h2>{kivalasztottTermek.name}</h2>
                <p><strong>Ár:</strong> {kivalasztottTermek.price} Ft</p>
            <p><strong>Leírás:</strong> {kivalasztottTermek.description}</p>
            <button onClick={() => {
  if (kivalasztottTermek) {
    hozzaadKosarhoz(kivalasztottTermek);
    setKivalasztottTermek(null); // Modal bezárása
  }
}}>
  Kosárba teszem
</button>
            </div>
        </div>
      )}
    </section>
  );
};

export default TermekLista;
