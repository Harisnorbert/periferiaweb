import React, { useEffect, useState } from "react";
import axios from "axios";
//import "./TermekLista.css";

const TermekLista = ({hozzaadKosarhoz }) => {
  const [termekek, setTermekek] = useState([]);
  const [kivalasztottTermek, setKivalasztottTermek] = useState(null);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);

  // Termékek lekérdezése
  useEffect(() => {  
    axios.get("http://localhost:5000/termekek")
      .then((res) => {
        console.log("Lekérdezett termékek:", res.data);
        setTermekek(res.data);
        setBetolt(false);
      })
      .catch((error) => {
        console.error("Hiba a termékek lekérdezésekor:", error);
        setHiba("Nem sikerült betölteni a termékeket.");
        setBetolt(false);
      });
  }, []);

  const reszletek = (termek) => {
    console.log("Kiválasztott termék:", termek);
    setKivalasztottTermek(termek);
  };

  if (betolt) return <p>Termékek betöltése...</p>;
  if (hiba) return <p>{hiba}</p>;

  return (
    <section id="termekek-szakasz">
      <h2>Elérhető termékek</h2>
      <div className="termek-lista">
        {termekek.length === 0 ? (
          <p>Jelenleg nincsenek elérhető termékek.</p>
        ) : (
          termekek.map((termek) => (
            <div
              className="termek-kartya"
              key={termek._id}
              onClick={() => reszletek(termek)}
            >
              <h3>{termek.name}</h3>
              <p>Ár: {termek.price} Ft</p>
              <p>{termek.description}</p>
            </div>
          ))
        )}
      </div>

      {kivalasztottTermek && (
        <div className="modal">
          <div className="modal-tartalom">
            <span
              className="modalzaras"
              onClick={() => setKivalasztottTermek(null)}
            >
              &times;
            </span>
            <h2>{kivalasztottTermek.name}</h2>
            <p>
              <strong>Ár:</strong> {kivalasztottTermek.price} Ft
            </p>
            <p>
              <strong>Leírás:</strong> {kivalasztottTermek.description}
            </p>
            <button
              onClick={() => {
                hozzaadKosarhoz(kivalasztottTermek);
                setKivalasztottTermek(null); // Modal bezárása kosárba helyezés után
              }}
            >
              Kosárba teszem
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TermekLista;
